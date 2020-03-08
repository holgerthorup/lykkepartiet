// Import
const R = require('ramda');
const odaFetcher = require('./odaFetcher');
const scrapeIt = require('scrape-it');
const getProposalList = require('../../db/proposal/getProposalList');
const updateProposalState = require('../../db/proposal/updateProposalState');
const resultsMailBatch = require('../../mail/resultsMailBatch');
const findStageInfo = require('../../db/proposal/findStageInfo');
const changeProposal = require('../../db/proposal/changeProposal');
const createProposal = require('../../db/proposal/createProposal');
const getVoteResults = require('../../db/vote/getVoteResults');

// Functions
async function ftBatchFetcher() {
  // console.log('ftBatchFetcher started');
  const proposalExpand = '&$expand=Sagsstatus,Periode,Sagstype,SagAkt%C3%B8r,Sagstrin/Afstemning';
  const proposalFilter = '&$filter=(typeid eq 3 or typeid eq 5) and periodeid eq 151';
  const proposalUrl = 'http://oda.ft.dk/api/Sag?$orderby=id desc' + proposalExpand + proposalFilter;
  const proposalList = await odaFetcher.fetchAllPages(proposalUrl);
  // console.log('oda.ft.dk responded with proposalList');
  const filteredProposalList = R.filter(function(proposal) {
    const doesExist = !R.isNil(proposal);
    // !doesExist && console.log('Filterd out empty proposal');
    const hasCommittee = R.path(['SagAktør'], proposal).length;
    // !hasCommittee && console.log('Filtered out proposal (' + proposal.nummer + ') because of missing committee');
    return doesExist && hasCommittee;
  }, proposalList);
  // console.log('proposal list was filtered for bad apples');
  const existingProposalList = await getProposalList();
  // disabled all mail
  // for (const proposal of existingProposalList) {
  //   const hasJustClosed = proposal.deadline === 'Afsluttet' && !proposal.state;
  //   hasJustClosed && (await updateProposalState(proposal.id, 'closed'));
  //   hasJustClosed && resultsMailBatch(proposal);
  // }
  for (const proposal of filteredProposalList) {
    const existingProposal = R.find(R.propEq('id', proposal.id))(existingProposalList);
    async function presentation() {
      const presentationUrl = `http://www.ft.dk/samling/${proposal.Periode.kode}/${
        proposal.Sagstype.type
      }/${proposal.nummerprefix + proposal.nummernumerisk}/${proposal.Periode.kode}_${proposal.nummerprefix +
        proposal.nummernumerisk}_fremsaettelsestale.htm`;
      const presentation = await scrapeIt(presentationUrl, {
        paragraphs: { listItem: '.TekstGenerel' },
        proposer: '.Fremsaetter'
      });
      if (!presentation.data.paragraphs.length) {
        // console.log('We could not find a presentation for proposal: ' + proposal.id);
        return null;
      } else {
        // console.log('I found a presentation!');
        return presentation.data;
      }
    }
    const stageInfo = findStageInfo(proposal.Sagstrin);
    const results = stageInfo.status === 'Afsluttet' && (await getVoteResults(proposal.id));
    const existingPresentation = R.path(['data', 'presentation'], existingProposal);
    const doNotLookForPresentation = existingPresentation || proposal.nummerprefix === 'B'; // beslutningforslag will never get a presentation
    if (!doNotLookForPresentation); // console.log('I am looking for a presentation...');
    const upsertedProposal = {
      id: proposal.id,
      data: {
        committeeId: R.find(R.propEq('rolleid', 11), proposal.SagAktør).aktørid,
        titel: proposal.titel,
        shortTitel: proposal.titelkort,
        type: proposal.Sagstype.type,
        resume: proposal.resume,
        number: proposal.nummer,
        numberPreFix: proposal.nummerprefix,
        numberNumeric: proposal.nummernumerisk,
        numberPostFix: proposal.nummerpostfix,
        statusId: proposal.Sagsstatus.id,
        status: stageInfo.status,
        deadline: stageInfo.deadline,
        distanceToDeadline: stageInfo.distanceToDeadline,
        periodId: proposal.Periode.id,
        periodCode: proposal.Periode.kode,
        period: proposal.Periode.titel,
        presentation: doNotLookForPresentation ? existingPresentation : await presentation(),
        results: results,
        actualResults: stageInfo.actualResults
      }
    };
    if (existingProposal) {
      await changeProposal(upsertedProposal.id, upsertedProposal.data);
      // console.log('Updated proposal with id: ' + proposal.id);
    } else {
      await createProposal(upsertedProposal.id, upsertedProposal.data);
      // console.log('Inserted new proposal with id: ' + proposal.id);
    }
  }
  // console.log('ftBatchFetcher finished');
}

// Export
module.exports = ftBatchFetcher;

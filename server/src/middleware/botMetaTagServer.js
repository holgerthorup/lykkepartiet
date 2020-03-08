const getCandidateProfile = require('../db/candidate/getCandidateProfile');
const getProjectProfile = require('../db/project/getProjectProfile');
const getProposalProfile = require('../db/proposal/getProposalProfile');
const buildIndexHTML = require('./buildIndexHTML');

async function botMetaTagServer(host, path) {
  const pathSplit = path.split('/');
  const entity = pathSplit[1];
  const entityId = pathSplit[2];
  let og = {
    // default and fall-back og:
    title: 'Lykkepartiets digitale platform | Lykkepartiet',
    description:
      'På Lykkepartiets digitale platform kan du følge med i alle forslag fra Folketinget, finde borgernes egne politiske projekter, udvikle dine egne projekter eller stille op som kandidat.',
    image: host + '/lykkepartiet_og.png',
    square: false,
    alt: 'Lykkepartiets logo på en stor hvid baggrund',
    url: host + path,
    host: host
  };
  if (entity === 'candidate') {
    const candidate = await getCandidateProfile(entityId);
    if (candidate) {
      og = {
        title: candidate.firstname + ' ' + candidate.lastname + ' | Lykkepartiet',
        description: candidate.motivation,
        image: candidate.picture + '?w=1200',
        square: true,
        alt: candidate.firstname + ' ' + candidate.lastname + ' | Lykkepartiet',
        url: host + path,
        host: host
      };
    }
  }
  if (entity === 'candidates') {
    og = {
      title: 'Lykkepartiets kandidater | Lykkepartiet',
      description:
        'På Lykkepartiets digitale platform kan du finde Lykkepartiets kandidater, læse om deres motivation og kvalifikationer, støtte den bedste, eller tilmelde dig opstilling på Lykkepartiets liste.',
      image: host + '/lykkepartiet_og.png',
      square: false,
      alt: 'Lykkepartiets logo på en stor hvid baggrund',
      url: host + path,
      host: host
    };
  }
  if (entity === 'project') {
    const project = await getProjectProfile(entityId);
    if (project) {
      og = {
        title: project.title + ' | Lykkepartiet',
        description: project.description,
    image: host + '/lykkepartiet_og.png',
        square: false,
        alt: project.title + ' | Lykkepartiet',
        url: host + path,
        host: host
      };
    }
  }
  if (entity === 'projects') {
    og = {
      title: 'Politiske projekter | Lykkepartiet',
      description:
        'På Lykkepartiets digitale platform kan du finde borgernes politiske projekter, støtte de bedste, eller udvikle dit eget projekt.',
      image: host + '/lykkepartiet_og.png',
      square: false,
      alt: 'Lykkepartiets logo på en stor hvid baggrund',
      url: host + path,
      host: host
    };
  }
  if (entity === 'proposal') {
    const proposal = await getProposalProfile(entityId);
    if (proposal) {
      og = {
        title: proposal.shortTitel + ' | Lykkepartiet',
        description: proposal.resume,
        image: host + '/assets/category-images/' + proposal.category + '.png',
        square: false,
        alt: proposal.shortTitel + ' | Lykkepartiet',
        url: host + path,
        host: host
      };
    }
  }
  if (entity === 'proposals') {
    og = {
      title: 'Forslag fra Folketinget | Lykkepartiet',
      description:
        'På Lykkepartiets digitale platformm kan du følge med i alle forslag fra Folketinget, læse deres resumeer og formål, give din mening til kende og se afstemningsresultaterne.',
      image: host + '/lykkepartiet_og.png',
      square: false,
      alt: 'Lykkepartiets logo på en stor hvid baggrund',
      url: host + path,
      host: host
    };
  }
  const html = buildIndexHTML(og);
  return html;
}

module.exports = botMetaTagServer;

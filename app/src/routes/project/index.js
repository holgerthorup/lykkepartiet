import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import R from 'ramda';
import LoadingSpinner from '../../components/loadingSpinner';
import Heading from '../../components/headingWithBackBtn';
import FeatherIcon from '../../components/featherIcon';
import DeclerationModal from './declerationModal';

class ProjectPage extends Component {
  constructor() {
    super();
    this.supportProject = this.supportProject.bind(this);
    this.giveDecleration = this.giveDecleration.bind(this);
  }

  async giveDecleration() {
    this.props.updateState({
      entityType: 'modal',
      entity: {
        content: <DeclerationModal updateState={this.props.updateState} giveDecleration={this.giveDecleration} />
      }
    });
    await fetch('/api/user/decleration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + window.localStorage.authToken
      }
    });
    const newUser = Object.assign({}, this.props.user, { decleration: true });
    this.props.updateState({ entityType: 'user', entity: newUser });
  }

  async supportProject() {
    if (this.props.anonymousUser) {
      this.props.updateState({ entityType: 'modal', entity: 401 });
    } else {
      const project = R.find(R.propEq('id', Number(this.props.match.params.id)), this.props.projectList);

      !this.props.user.decleration && !project.isSupporting && this.setState({ showModal: true });

      this.props.updateState({
        entityType: 'projectSupportList',
        entity: { id: project.id, isSupporting: project.isSupporting }
      });

      const response = await fetch(`/api/project/${project.id}/support`, {
        method: 'POST',
        body: JSON.stringify({
          support: !project.isSupporting
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + window.localStorage.authToken
        }
      });
      if (!response.ok) {
        this.props.updateState({ entityType: 'modal', entity: response.status });
      }
    }
  }

  render() {
    const project = R.find(R.propEq('id', Number(this.props.match.params.id)), this.props.projectList);
    const appReady = this.props.appReady;
    if (!project && (!appReady || appReady === 'cache')) {
      return <LoadingSpinner />;
    }
    if (!project && appReady && appReady !== 'cache') {
      return (
        <div className="flex-auto px-2">
          <div className="max-w-xl mx-auto text-center">
            <h1>Ups! Der er problemer</h1>
            <p className="mx-auto">Det lader ikke til at projektet du leder efter findes.</p>
            <Link to={'/projects'} className="btn btn-white mt-4 mb-8">
              <FeatherIcon name="ArrowLeft" className="mr-2" />Gå til listen med projekter
            </Link>
            <p className="mx-auto">
              Burde der være en side her?{' '}
              <a href="mailto:dinevenner@lykkepartiet.dk" className="inline-link">
                Send os en mail
              </a>.
            </p>
          </div>
        </div>
      );
    }
    const user = this.props.user;
    if (project) {
      const description =
        (project.description && R.filter(paragraph => paragraph !== '')(project.description.split(/\n/))) || [];
      const budget = (project.budget && R.filter(paragraph => paragraph !== '')(project.budget.split(/\n/))) || [];
      const argument =
        (project.argument && R.filter(paragraph => paragraph !== '')(project.argument.split(/\n/))) || [];
      const risk = (project.risk && R.filter(paragraph => paragraph !== '')(project.risk.split(/\n/))) || [];
      return (
        <div className="flex-auto px-2">
          <div className="max-w-xl mx-auto">
            <Heading title={project.title} />
            <div className="block md:hidden flex -mx-1 mb-4">
              <a
                href={`https://facebook.com/sharer/sharer.php?u=https://app.lykkepartiet.dk/project/${project.id}`}
                target="_fbshare"
                rel="noopener noreferrer"
                className="btn btn-facebook w-full min-w-0 mx-1">
                Del på Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=Spændende%20projekt%20på%20Lykkepartiets%20platform:%20${
                  project.title
                }!&url=https://app.lykkepartiet.dk/project/${project.id}&via=lykkepartiet`}
                target="_twittershare"
                rel="noopener noreferrer"
                className="btn btn-twitter w-full min-w-0 mx-1">
                Del på Twitter
              </a>
            </div>
            <div className="flex flex-wrap md:flex-no-wrap -m-1">
              <div className="w-full m-1">
                <div className="bg-white border border-grey-lighter rounded-sm shadow px-4 md:px-8 py-8">
                  <article className="mb-8">
                    <h3>Beskrivelse</h3>
                    {description.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                  </article>
                  <article className="mb-8">
                    <h3>Budgettering</h3>
                    {budget.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                  </article>
                  <article className="mb-8">
                    <h3>Begrundelse og argumentation</h3>
                    {argument.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                  </article>
                  <article>
                    <h3>Risiko og udfordringer</h3>
                    {risk.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                  </article>
                </div>
              </div>
              <div className="w-full md:w-64 md:flex-no-shrink m-1">
                <div className="bg-white border border-grey-lighter rounded-sm shadow mb-2">
                  <h4 className="text-center border-b border-grey-lighter p-2">Initiativtager</h4>
                  <div className="text-center text-grey-darker p-4">
                    <span className="block mb-4">{project.initiator.name}</span>
                    <p className="break-words mb-4">{project.initiator.bio}</p>
                    <a href={`mailto:${project.initiator.email}`} className="btn btn-secondary">
                      Kontakt initiativtager
                    </a>
                  </div>
                </div>
                <div className="md:sticky md:top-15">
                  <div className="bg-white border border-grey-lighter rounded-sm shadow mb-2">
                    <h4 className="text-center border-b border-grey-lighter p-2">Projekt</h4>
                    <div className="text-center text-grey-darker p-4">
                      <span className="block mb-4">Kategori: {project.category.title}</span>
                      <span className="block mb-4">Støtter: {project.support} brugere</span>
                      {user && project.initiator.email === user.email ? (
                        <Link to={`${project.id}/edit`} className="btn btn-primary">
                          Rediger projekt
                        </Link>
                      ) : project.isSupporting ? (
                        <button
                          onClick={this.supportProject}
                          onMouseDown={e => e.preventDefault()}
                          className="btn btn-secondary">
                          Træk støtte tilbage
                        </button>
                      ) : (
                        <button
                          onClick={this.supportProject}
                          onMouseDown={e => e.preventDefault()}
                          className="btn btn-primary">
                          Støt projektet
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <a
                      href={`https://facebook.com/sharer/sharer.php?u=https://app.lykkepartiet.dk/project/${project.id}`}
                      target="_fbshare"
                      rel="noopener noreferrer"
                      className="btn btn-facebook w-full mb-2">
                      Del projektet på Facebook
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=Spændende%20projekt%20på%20Lykkepartiets%20platform:%20${
                        project.title
                      }!&url=https://app.lykkepartiet.dk/project/${project.id}&via=lykkepartiet`}
                      target="_twittershare"
                      rel="noopener noreferrer"
                      className="btn btn-twitter w-full">
                      Del projektet på Twitter
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default ProjectPage;

import '@pnp/sp/webs';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { sp } from '@pnp/sp/presets/all';

import { HostedSearchPage } from '@coveops/hosted-search-page';
import * as Coveo from 'coveo-search-ui';

import SearchInterfaceTemplate from './SearchInterfaceTemplate';
import CoveoConfig from '../../CoveoConfig';

export interface ICoveoIntegrationWebPartProps {
  description: string;
}

export default class CoveoIntegrationWebPart extends BaseClientSideWebPart<ICoveoIntegrationWebPartProps> {

  constructor() {
    super();

    sp.setup({
      spfxContext: this.context
    });

    this.defineCoveoCustomParameters();
  }

  public render(): void {
    // We need to add external dependencies used in the web part here to "load" them.
    Coveo;
    HostedSearchPage;

    this.domElement.innerHTML = SearchInterfaceTemplate.templateHtml;

    this.getPageAndInit();
  }

  public getPageAndInit() {
    // Build the search endpoint
    Coveo.SearchEndpoint.endpoints['default'] = new Coveo.SearchEndpoint({
      restUri: Coveo['customParameters'].coveoRestURI,
      accessToken: Coveo['customParameters'].coveoSearchAPIKey,
      queryStringArguments: {
        organizationId: Coveo['customParameters'].coveoOrgId
      }
    });

    // Get the root HTML element and cast it to the HostedSearchPage object
    var hostedSearchPage = <HostedSearchPage>document.getElementById('hsp');

    // Listen on the search page API callback
    document.addEventListener('CoveoExternalScriptsLoaded', () => {
      Coveo.init(hostedSearchPage.searchPage.querySelector('.CoveoSearchInterface'), {});
    });
    
    // Configure the search page API and sent the request for the page content
    hostedSearchPage.configure({
      orgId: Coveo['customParameters'].coveoOrgId,
      apiKey: Coveo['customParameters'].coveoSearchAPIKey, 
      pageId: Coveo['customParameters'].coveoPageId
    });
  }
  
  private defineCoveoCustomParameters() {
    Coveo['customParameters'] = Coveo['customParameters'] || CoveoConfig;
  }
}

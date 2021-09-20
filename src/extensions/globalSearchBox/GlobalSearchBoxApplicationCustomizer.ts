import {
  BaseApplicationCustomizer,
  ApplicationCustomizerContext,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { sp } from '@pnp/sp/presets/all';

require('coveo-search-ui');
require('./../../../node_modules/coveo-search-ui/bin/css/CoveoFullSearch.min.css');

import SearchBoxTemplate from './SearchBoxTemplate';
import CoveoConfig from '../../CoveoConfig';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IGlobalSearchBoxApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class GlobalSearchBoxApplicationCustomizer
  extends BaseApplicationCustomizer<IGlobalSearchBoxApplicationCustomizerProperties> {

  private topPlaceHolder: PlaceholderContent | undefined;
  private appContext: ApplicationCustomizerContext = null;

  private urlParams = new URLSearchParams(window.location.search);

  public constructor() {
    super();

    sp.setup({
      spfxContext: this.context
    });

    this.defineCoveoCustomParameters();
  }

  public onInit(): Promise<void> {   
    return new Promise<void>((resolve: () => void, reject: (error: any) => void): void => {
      try {
        this.appContext = this.context;
        this.context.placeholderProvider.changedEvent.add(this, () => { this.renderPlaceholders(false, false) });

        this.bindPushStateEvent();
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  private renderPlaceholders(forceInit: boolean, forceRedirect: boolean) {
    this.replaceHeaderDOM();

    // We need to remove the reload query parameter to allow the pushState logic to work twice
    if (this.urlParams.get('reload')) {
      location.href = `https://${location.host}${Coveo['customParameters'].coveoSearchPageUrl}${location.hash}`;
    }

    // Initialize the search box if we are not on the full search page
    if (forceInit || (!document.querySelector('#custom-coveo-main-search-interface') && location.pathname  !== Coveo['customParameters'].coveoSearchPageUrl)) {
      this.initSearchbox(forceRedirect)
    }
  }

  // Replace the DOM of the top content placeholder
  public replaceHeaderDOM() {
    if (!this.topPlaceHolder) {
      this.topPlaceHolder = this.appContext.placeholderProvider.tryCreateContent(PlaceholderName.Top, { onDispose: this.onDispose });
    }

    if (this.topPlaceHolder.domElement) {
      this.topPlaceHolder.domElement.innerHTML = SearchBoxTemplate.templateHTML;
    }  
  }

  private initSearchbox(forceRedirect: boolean): void {
    // Build the search endpoint
    Coveo.SearchEndpoint.endpoints['default'] = new Coveo.SearchEndpoint({
      restUri: Coveo['customParameters'].coveoRestURI,
      accessToken: Coveo['customParameters'].coveoSearchAPIKey,
      queryStringArguments: {
        organizationId: Coveo['customParameters'].coveoOrgId
      }
    });

    // Initialize the search box
    console.log('Extension initialization');
    
    Coveo.initSearchbox(
      document.getElementById('custom-coveo-standalone-search-box'),
      Coveo['customParameters'].coveoSearchPageUrl + (forceRedirect ? '?reload=true' : ''), {
        Analytics: {
          searchHub: Coveo['customParameters'].coveoSearchHub
        }
      }
    );
  }

  private bindPushStateEvent() {
    let pushState = history.pushState;
    let that = this;

    history.pushState = function () {
      if (!arguments[2].includes(Coveo['customParameters'].coveoSearchPageUrl)) {
        if (arguments[2].includes('Mode=Edit')) {
          that.renderPlaceholders(true, true);
        } else {
          that.renderPlaceholders(true, false);
        }
      } else if (arguments[2].includes('Mode=Edit') || arguments[2].includes('CreateSitePage.aspx')) {
        that.renderPlaceholders(true, true);
      }
      
      pushState.apply(history, arguments);
    };

    var replaceState = history.replaceState;
    history.replaceState = function () {
      if (!arguments[2].includes(Coveo['customParameters'].coveoSearchPageUrl)) {
        if (arguments[2].includes('Mode=Edit')) {
          that.renderPlaceholders(true, true);
        } else {
          that.renderPlaceholders(true, false);
        }
      } else if (arguments[2].includes('Mode=Edit') || arguments[2].includes('CreateSitePage.aspx')) {
        that.renderPlaceholders(true, true);
      }

      replaceState.apply(history, arguments);
    };
  }

  private defineCoveoCustomParameters() {
    Coveo['customParameters'] = Coveo['customParameters'] || CoveoConfig;
  }
}

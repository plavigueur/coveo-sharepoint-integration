export default class SearchBox {
  public static templateHTML: string = `
    <style>
      #custom-coveo-standalone-search-box .CoveoOmnibox {
        height: 35px;
      }

      #custom-coveo-standalone-search-box .CoveoOmnibox .magic-box-input input {
        height: 35px;
      }

      #custom-coveo-standalone-search-box .CoveoOmnibox.magic-box .magic-box-input .magic-box-underlay {
        height: 33px;
      }

      #custom-coveo-standalone-search-box .CoveoOmnibox .magic-box-input {
        height: 35px;
        border-radius: 0px;
      }

      #custom-coveo-standalone-search-box .CoveoOmnibox.magic-box .magic-box-clear,
      #custom-coveo-standalone-search-box .CoveoOmnibox.magic-box .magic-box-clear .magic-box-icon {
        height: 35px;
      }

      #custom-coveo-standalone-search-box .CoveoOmnibox.magic-box .magic-box-clear .magic-box-icon svg {
        height: 35px;
        padding-top: 2px;
      }

      #custom-coveo-standalone-search-box .CoveoSearchButton  {
        height: 35px;
        border: none;
        margin-top: 1px;
        background: white;
        margin-left: -1px;
        border-left: 1px solid #9f9f9f;
      }

      .search-form {
        position: fixed;
        width: 500px;
        left: calc(50% - 250px);
        top: 6px;
        z-index: 999;
      }

      #custom-coveo-standalone-search-box {
        display: block;
        width: 500px;
        margin: 0 auto 0 auto;
      }

      .CoveoSearchInterface .coveo-search-section {
        margin: 0 !important;
      }
    </style>
    
    <section class="search-form">
      <div id="custom-coveo-standalone-search-box">
        <div class="CoveoAnalytics"></div>
        <div class="CoveoSearchbox"></div>
        <div class="CoveoFieldSuggestions" data-field="@author" data-header-title="Author"></div>
        <script class="CoveoPipelineContext" type="text/context"></script>
      </div>
    </section>
    `;
}
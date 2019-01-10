import '@polymer/polymer/polymer-element.js';

const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `<dom-module id="shared-styles">
  <template>
    <style>
      a, u {
        text-decoration: none;
      }      

      h1 {
        margin: 16px 0;
        color: #212121;
        font-size: 22px;
      }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
(function() {
  'use strict';

  let mac_str = ['', '', '', '', '', ''];
  let inputSlot = [];
  let fail_count = 0;
  const valid_char = ['a', 'b', 'c', 'd', 'e', 'f', 'A', 'B', 'C', 'D', 'E', 'F', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  customElements.define('mac-input', class extends HTMLElement {
    constructor() {
      super(); // always call super() first in the ctor.
      let shadowRoot = this.attachShadow({mode: 'open'});

      this.realInput = null;
      this._onKeyInput = this._onKeyInput.bind(this);
      this._onKeyDown = this._onKeyDown.bind(this);
    }

    get value() {
      var mac_all = mac_str.join('-');
      return mac_all.toLowerCase();
    }
    set value(val) {
      return;
    }

    connectedCallback() {
      // render DOM
      this.shadowRoot.innerHTML = this.template()

      // render style
      const styleElement = document.createElement('style')
      styleElement.appendChild(document.createTextNode(`
        input {
          max-width: 50px;
        }
      `))
      this.shadowRoot.appendChild(styleElement)

      this.realInput = document.createElement('input')
      if (this.hasAttribute('name')) {
        this.realInput.name = this.attributes.name.value
      }
      this.realInput.type = 'hidden'
      this.appendChild(this.realInput)

      inputSlot[0] = this.shadowRoot.querySelector('input:nth-child(1)');
      inputSlot[1] = this.shadowRoot.querySelector('input:nth-child(2)');
      inputSlot[2] = this.shadowRoot.querySelector('input:nth-child(3)');
      inputSlot[3] = this.shadowRoot.querySelector('input:nth-child(4)');
      inputSlot[4] = this.shadowRoot.querySelector('input:nth-child(5)');
      inputSlot[5] = this.shadowRoot.querySelector('input:nth-child(6)');
      inputSlot[0].focus();
      var mac_input_element = this;
      inputSlot.forEach(function(element) {
        //console.log(mac_input_element._onKeyUp);
        element.addEventListener('input', mac_input_element._onKeyInput);
        element.addEventListener('keydown', mac_input_element._onKeyDown);
      });
    }

    _onKeyDown(e) {
      var input_index = parseInt(e.target.id.substr(e.target.id.length - 1));
      var keyin = parseInt(e.which || e.keyCode);
      if(!isNaN(keyin)) {
        if(keyin == 8 && e.target.value == '') {
          if(input_index > 0) {
            //console.log(input_index);
            inputSlot[input_index - 1].focus();
            inputSlot[input_index - 1].dispatchEvent(new KeyboardEvent('keypress', {'code': 8}));
          }
        }
      }
    }

    _onKeyInput(e) {
      var input_index = parseInt(e.target.id.substr(e.target.id.length - 1));
      mac_str[input_index] = '';
      for (var i = 0; i < e.target.value.length; i++) {
        if(valid_char.includes(e.target.value.charAt(i))) {
          mac_str[input_index] += e.target.value.charAt(i);
        }
      }
      if(e.target.value.length != mac_str[input_index].length) {
        fail_count += 1;
        if(fail_count % 3 == 0) {
          alert("Please valid mac address character (a-z, A-Z or 0-9)");
        }
      }
      e.target.value = mac_str[input_index];
      if(e.target.value.length == 2) {
        if(input_index < 5) {
          inputSlot[input_index + 1].focus();
        }
      }
      var mac_all = mac_str.join('-');
      this.realInput.value = mac_all;
      this.dispatchEvent(new Event("change"));
      return;
    }

    template () {
      return `
        <p>Please enter mac address below</p>
        <div class="wrapper">
          <input type="text" id="in_0" maxlength="2">-
          <input type="text" id="in_1" maxlength="2">-
          <input type="text" id="in_2" maxlength="2">-
          <input type="text" id="in_3" maxlength="2">-
          <input type="text" id="in_4" maxlength="2">-
          <input type="text" id="in_5" maxlength="2">
        </div>
      `
    }
  });
}) ();
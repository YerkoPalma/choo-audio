var choo = require('choo')
var html = require('choo/html')

var app = choo()
if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
}
app.use(require('..')())
app.route('/', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
      <ul>
        <li>
          <meter value="0.3"></meter>
          <meter value="0.2"></meter>
          <meter value="0.16"></meter>
          <meter value="0.2"></meter>
          <meter value="0.3"></meter>
        </li>
    
        <li>
          <input type="range" />
        </li>
    
        <li>
          <input type="checkbox" data-icon1="♀" data-icon2="♂" />
        </li>
    
        <li>
          <input type="number" min="1" max="99" value="78" />
        </li>
    
        <li>
          <input type="radio" name="radio" data-icon="❮❮" /><input type="radio" name="radio" data-icon="►" /><input type="radio" name="radio" data-icon="❯❯" />
        </li>
    
            <li>
              <progress value="0.3"></progress>
            </li>
    
      </ul>
    </body>
  `
}

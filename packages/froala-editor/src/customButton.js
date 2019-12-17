import Froalaeditor from 'froala-editor';
import bold from '@material-ui/icons/WbSunnyOutlined';

// import bold from '@material-ui/icons/WbSunnyOutlined';
// Froalaeditor.DefineIcon('bold', {
//   NAME: 'info',
//   SRC: bold
// });
// Froalaeditor.RegisterCommand('bold', {
//   title: 'Hello',
//   focus: false,
//   undo: false,
//   refreshAfterCallback: false,
//   callback: function() {
//     alert('Hello!');
//   }
// });

Froalaeditor.DefineIcon('clear', { NAME: 'remove', SVG_KEY: 'remove' });
Froalaeditor.RegisterCommand('clear', {
  title: 'Clear HTML',
  focus: false,
  undo: true,
  refreshAfterCallback: true,
  callback: function() {
    this.html.set('');
    this.events.focus();
  }
});

Froalaeditor.DefineIcon('insert', { NAME: 'plus', SVG_KEY: 'add' });
Froalaeditor.RegisterCommand('insert', {
  title: 'Insert HTML',
  focus: true,
  undo: true,
  refreshAfterCallback: true,
  callback: function() {
    this.html.insert('My New HTML');
  }
});

export default Froalaeditor;

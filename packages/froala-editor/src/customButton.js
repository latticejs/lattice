import Froalaeditor from 'froala-editor';

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

Froalaeditor.DefineIconTemplate('material_design', '<i class="zmdi zmdi-[NAME]"></i>');
// Froalaeditor.ICON_DEFAULT_TEMPLATE = 'material_design';
Froalaeditor.DefineIcon('bold', { NAME: 'format-bold', template: 'material_design' });
Froalaeditor.RegisterCommand('bold', {
  title: 'Bold',
  icon: 'bold',
  focus: true,
  undo: true
});

export default Froalaeditor;

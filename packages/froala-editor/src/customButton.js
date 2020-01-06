import Froalaeditor from 'froala-editor';

Froalaeditor.DefineIconTemplate('material_design', '<i class="zmdi zmdi-[NAME] design"></i>');
// Froalaeditor.DefineIconTemplate('material_design', '<i class="material-icons">[NAME]</i>');
Froalaeditor.DefineIcon('bold', { NAME: 'format-bold', template: 'material_design' });
Froalaeditor.RegisterCommand('bold', {
  title: 'Bold',
  icon: 'bold',
  focus: true,
  undo: true
});

Froalaeditor.DefineIcon('italic', { NAME: 'format-italic', template: 'material_design' });
Froalaeditor.RegisterCommand('italic', {
  title: 'Italic',
  icon: 'italic',
  // focus: true,
  undo: true
});

Froalaeditor.DefineIcon('underline', { NAME: 'format-underlined', template: 'material_design' });
Froalaeditor.RegisterCommand('underline', {
  title: 'Underline',
  icon: 'underline',
  // focus: true,
  undo: true
});

Froalaeditor.DefineIcon('strikeThrough', { NAME: 'format-strikethrough', template: 'material_design' });
Froalaeditor.RegisterCommand('strikeThrough', {
  title: 'StrikeThrough',
  icon: 'strikeThrough',
  focus: true,
  undo: true
});

Froalaeditor.DefineIcon('emoticons', { NAME: 'insert-emoticon', template: 'material_design' });
Froalaeditor.RegisterCommand('emoticons', {
  title: 'Emoticons',
  icon: 'emoticons',
  focus: true,
  undo: true
});

Froalaeditor.DefineIcon('selectAll', { NAME: 'select-all', template: 'material_design' });
Froalaeditor.RegisterCommand('selectAll', {
  title: 'Select All',
  icon: 'selectAll',
  focus: true,
  undo: true
});

Froalaeditor.DefineIcon('html', { NAME: 'code', template: 'material_design' });
Froalaeditor.RegisterCommand('html', {
  title: 'Code View',
  icon: 'html',
  focus: true,
  undo: true
});
export default Froalaeditor;

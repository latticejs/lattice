import Froalaeditor from 'froala-editor';

Froalaeditor.DefineIconTemplate('material_design', '<i class="zmdi zmdi-[NAME] zmdi-hc-2x"></i>');
Froalaeditor.DefineIcon('bold', { NAME: 'format-bold', template: 'material_design' });
Froalaeditor.DefineIcon('italic', { NAME: 'format-italic', template: 'material_design' });
Froalaeditor.DefineIcon('underline', { NAME: 'format-underlined', template: 'material_design' });
Froalaeditor.DefineIcon('strikeThrough', { NAME: 'format-strikethrough', template: 'material_design' });
Froalaeditor.DefineIcon('emoticons', { NAME: 'insert-emoticon', template: 'material_design' });
Froalaeditor.DefineIcon('selectAll', { NAME: 'select-all', template: 'material_design' });
Froalaeditor.DefineIcon('html', { NAME: 'code', template: 'material_design' });
Froalaeditor.DefineIcon('outdent', { NAME: 'format-indent-decrease', template: 'material_design' });
Froalaeditor.DefineIcon('indent', { NAME: 'format-indent-increase', template: 'material_design' });
Froalaeditor.DefineIcon('insertFile', { NAME: 'file', template: 'material_design' });
Froalaeditor.DefineIcon('print', { NAME: 'print', template: 'material_design' });
Froalaeditor.DefineIcon('getPDF', { NAME: 'collection-pdf', template: 'material_design' });
Froalaeditor.DefineIcon('help', { NAME: 'help-outline', template: 'material_design' });
Froalaeditor.DefineIcon('fullscreen', { NAME: 'fullscreen', template: 'material_design' });
Froalaeditor.DefineIcon('undo', { NAME: 'undo', template: 'material_design' });
Froalaeditor.DefineIcon('redo', { NAME: 'redo', template: 'material_design' });
Froalaeditor.DefineIcon('moreMisc', { NAME: 'more-vert', template: 'material_design' });
Froalaeditor.DefineIcon('strikeThrough', { NAME: 'format-strikethrough-s', template: 'material_design' });
Froalaeditor.DefineIcon('fontSize', { NAME: 'format-size', template: 'material_design' });
Froalaeditor.DefineIcon('fontFamily', { NAME: 'font', template: 'material_design' });
Froalaeditor.RegisterCommand('fontFamily', {
  title: 'Font Family',
  icon: 'fontFamily',
  type: 'dropdown',
  focus: true,
  undo: true,
  html: function() {
    return `<ul class="fr-dropdown-list" role="presentation">
  <li role="presentation">
    <a class="fr-command" tabindex="-1" role="option" data-cmd="fontFamily" data-param1="Roboto,sans-serif" style="font-family: Roboto,sans-serif" title="Roboto" aria-selected="false">
      Roboto
    </a>
  </li>
  <li role="presentation">
    <a class="fr-command" tabindex="-1" role="option" data-cmd="fontFamily" data-param1="Montserrat,sans-serif" style="font-family: Montserrat,sans-serif" title="Montserrat" aria-selected="false">
      Montserrat
    </a>
  </li>
  <li role="presentation">
    <a class="fr-command" tabindex="-1" role="option" data-cmd="fontFamily" data-param1="Arial,Helvetica,sans-serif" style="font-family: Arial,Helvetica,sans-serif" title="Arial" aria-selected="false">
      Arial
    </a>
  </li>
  <li role="presentation">
    <a class="fr-command" tabindex="-1" role="option" data-cmd="fontFamily" data-param1="Georgia,serif" style="font-family: Georgia,serif" title="Georgia" aria-selected="false">
      Georgia
    </a>
  </li>
  <li role="presentation">
    <a class="fr-command" tabindex="-1" role="option" data-cmd="fontFamily" data-param1="Impact,Charcoal,sans-serif" style="font-family: Impact,Charcoal,sans-serif" title="Impact" aria-selected="false">
      Impact
    </a>
  </li>
  <li role="presentation">
    <a class="fr-command" tabindex="-1" role="option" data-cmd="fontFamily" data-param1="Tahoma,Geneva,sans-serif" style="font-family: Tahoma,Geneva,sans-serif" title="Tahoma" aria-selected="false">
      Tahoma
    </a>
  </li>
  <li role="presentation">
    <a class="fr-command" tabindex="-1" role="option" data-cmd="fontFamily" data-param1="Times New Roman,Times,serif,-webkit-standard" style="font-family: Times New Roman,Times,serif,-webkit-standard" title="Times New Roman" aria-selected="false">
      Times New Roman
    </a>
  </li>
  <li role="presentation">
    <a class="fr-command" tabindex="-1" role="option" data-cmd="fontFamily" data-param1="Verdana,Geneva,sans-serif" style="font-family: Verdana,Geneva,sans-serif" title="Verdana" aria-selected="false">
      Verdana
    </a>
  </li>
</ul>`;
  },
  callback: function(cmd, val) {
    this.fontFamily.apply(val);
  }
});
Froalaeditor.DefineIcon('moreText', { NAME: 'text-format', template: 'material_design' });
Froalaeditor.DefineIcon('formatOLSimple', { NAME: 'format-list-numbered', template: 'material_design' });
Froalaeditor.DefineIcon('insertLink', { NAME: 'link', template: 'material_design' });
Froalaeditor.DefineIcon('insertImage', { NAME: 'image-o', template: 'material_design' });
Froalaeditor.DefineIcon('textColor', { NAME: 'format-color-text', template: 'material_design' });
Froalaeditor.DefineIcon('backgroundColor', { NAME: 'brush', template: 'material_design' });
Froalaeditor.DefineIcon('clearFormatting', { NAME: 'format-clear', template: 'material_design' });
Froalaeditor.DefineIcon('formatOL', { NAME: 'format-list-numbered', template: 'material_design' });
Froalaeditor.DefineIcon('formatUL', { NAME: 'format-list-bulleted', template: 'material_design' });
Froalaeditor.DefineIcon('lineHeight', { NAME: 'format-line-spacing', template: 'material_design' });
export default Froalaeditor;

$(function(){$("input,textarea").jqBootstrapValidation({preventSubmit:!0,submitSuccess:function(c,d){if(!c.attr('action')){d.preventDefault();var f=getProcessorPath(c);var g={};c.find("input, textarea, option:selected").each(function(e){var a=$(this).val();var b=$(this).attr('id');if($(this).is(':checkbox')){a=$(this).is(":checked")}else if($(this).is(':radio')){a=$(this).val()+' = '+$(this).is(":checked")}else if($(this).is('option:selected'))Selects{b=$(this).parent().attr('id')}g[b]=a});$.ajax({url:f,type:"POST",data:g,cache:!1,success:function(){if(c.is('[success-msg]')){c.append("<div id='form-alert'><div class='alert alert-success'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><strong>"+c.attr('success-msg')+"</strong></div></div>")}else{window.location.replace(c.attr('success-url'))}c.trigger("reset")},error:function(){if($('#form-alert').length==0){c.append("<div id='form-alert'><div class='alert alert-danger'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><strong>"+c.attr('fail-msg')+"</strong></div></div>")}},})}},filter:function(){return $(this).is(":visible")},});function getProcessorPath(a){var b="./includes/"+a.attr('id')+".php";if(a.attr('template-path')){b=a.attr('template-path')+"/includes/"+a.attr('id')+".php"}return b}})
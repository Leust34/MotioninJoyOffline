var dfMap = new Array(0x0200, 0x0201, 0x0202, 0x0203, 0x0204, 0x0205, 0x0206, 0x0207, 0x0208, 0x0209, 0x020a, 0x020b, 0x020c, 0x0214, 0x0215, 0x0216, 0x0217, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0000, 0x0100, 0x0101, 0x0102, 0x0103, 0x0104, 0x0105, 0x010a, 0x010b, 0x0106, 0x0107, 0x0108, 0x0109);
var MIJconfig;
var option;
$(function ()
{
    SetBusy(false);
    $.spin.imageBasePath = 'misc/images/';
    $('#Interval').spin(
    {
        interval: 10,
        min: 20
    });
    $('#Duration').spin(
    {
        interval: 10,
        min: 20
    });
    $("#tabs").tabs();
    $('.INPUTOBJ').html($('#InputLayout').html());
    $('#DeviceType').change(function ()
    {
        option.Layout = $(this).val();
        Display(option)
    });
    if (VersionTool >= VER)
    {
        //setConfirmUnload(true);
        MIJconfig = eval('(' + window.external.MIJconfig(0, 0, "") + ')');
        if (MIJconfig['inputIndex'][0] < MIJconfig['dxinputOptions'].length)
        {
            option = MIJconfig['dxinputOptions'][MIJconfig['inputIndex'][0]]
        }
        else
        {
            MIJconfig['inputIndex'][0] = 0;
            option = MIJconfig['dxinputOptions'][MIJconfig['inputIndex'][0]]
        }
        listConfig(MIJconfig['dxinputOptions']);
        Display(option);
        $('#addnew').click(function ()
        {
            MIJconfig['dxinputOptions'].push(eval('(' + '{"__type":"MIJ_inputOption:#MotinoinJoy","Duration":100,"Interval":400,"Layout":"DS3","Macro":[],"Maps":[],"description":"","name":"' + $('#newname').val() + '"}' + ')'));
            MIJconfig['inputIndex'][0] = MIJconfig['dxinputOptions'].length - 1;
            option = MIJconfig['dxinputOptions'][MIJconfig['inputIndex'][0]];
            Default(option);
            Display(option);
            listConfig(MIJconfig['dxinputOptions'])
        });
        $('#addnewmacro').click(function ()
        {
            if (option.Macro == null)
            {
                option.Macro = new Array()
            }
            var newmacro = eval('(' + '{"__type":"MIJ_Macro:#MotinoinJoy","command":[0x200,0x201,0x202,0x203,0x204,0x205],"b1":[],"b2":[],"b3":[],"b4":[],"b5":[],"b6":[],"description":"","duration":800,"name":"' + $('#newmacroname').val() + '"}' + ')');
            for (var i = 0; i < 128; i++)
            {
                newmacro.b1[i] = 0;
                newmacro.b2[i] = 0;
                newmacro.b3[i] = 0;
                newmacro.b4[i] = 0;
                newmacro.b5[i] = 0;
                newmacro.b6[i] = 0
            }
            option.Macro.push(newmacro);
            Display(option);
            return false
        });
        $('#Enable').click(function ()
        {
            mmm(Mxxx, Myyy, Mvvvv);
            getValue(option);
            MIJconfig['cmOptions'].mode = 4;
            SaveConfig(MIJconfig);
            //setConfirmUnload(false)
        });
        $('#Default').click(function ()
        {
            Default(option);
            Display(option);
            mmm(Mxxx, Myyy, Mvvvv)
        });
        $('#GPProperty').click(function ()
        {
            mmm(Mxxx, Myyy, Mvvvv);
            cPannel()
        })
    }
});

function Display(oc)
{
    $('#DeviceType').val(oc.Layout);
    changelayout(oc.Layout);
    for (var i in oc.Maps)
    {
        var mv = oc.Maps[i];
        switch (mv & 0x1f00)
        {
        case 0x0200:
            $("#X-" + i + ' select').val('0x' + (mv & 0xff1f).toString(16));
            $("#A-" + i).html('<input type="checkbox"/>');
            $("#T-" + i).html('<input type="checkbox"/>');
            $('#M-' + i).html('');
            if ((mv & 0x8000) != 0)
            {
                $("#A-" + i + ' :checkbox').attr('checked', true)
            }
            if ((mv & 0x4000) != 0)
            {
                $("#T-" + i + ' :checkbox').attr('checked', true)
            }
            break;
        case 0x0100:
            $("#X-" + i + ' select').val('0x' + (mv & 0xff0f).toString(16));
            $("#A-" + i).html('');
            $("#T-" + i).html('');
            $('#M-' + i).html('');
            break;
        case 0x0800:
            $("#X-" + i + ' select').val('0x800');
            $("#A-" + i).html('');
            $("#T-" + i).html('');
            $('#M-' + i).addClass('MSelect').html('<select class="XMSelect"></select>');
            break;
        case 0x0900:
            $("#X-" + i + ' select').val('0x' + (mv & 0x0fff).toString(16));
            break;
        default:
            $("#A-" + i).html('');
            $("#T-" + i).html('');
            $('#M-' + i).html('');
            break
        }
    }
    $('#Interval').val(oc.Interval);
    $('#Duration').val(oc.Duration);
    listMacro(oc.Macro)
}
function Default(oc)
{
    for (var i = 0; i < dfMap.length; i++)
    {
        oc.Maps[i] = dfMap[i]
    }
    oc.Interval = 400;
    oc.Duration = 100
}
function changelayout(type)
{
    var html = '';
    var obj = null;
    var vlue = null;
    switch (type)
    {
    case "XBOX360":
        obj = X360Obj;
        vlue = X360Val;
        break;
    case "XBOX":
        obj = XboxObj;
        vlue = XboxVal;
        break;
    case "Generic":
        obj = GgcObj;
        vlue = GgcVal;
        break;
    case "PSMOVE":
    case "DS3":
    default:
        obj = DS3Obj;
        vlue = DS3Val;
        break
    }
    for (var i in obj)
    {
        html += '<tr id="TR-' + vlue[i] + '" class="' + (i % 2 == 0 ? 'odd' : 'even') + '">';
        html += '<td id="O-' + vlue[i] + '">' + obj[i] + '</td>';
        html += '<td id="X-' + vlue[i] + '" value="' + vlue[i] + '" class="INPUTOBJ"></td>';
        html += '<td id="A-' + vlue[i] + '" value="' + vlue[i] + '"></td>';
        html += '<td id="T-' + vlue[i] + '" value="' + vlue[i] + '"></td>';
        html += '<td id="M-' + vlue[i] + '" value="' + vlue[i] + '"></td>';
        html += '</tr>'
    }
    $('#maptab').html(html);
    $('.INPUTOBJ').html($('#InputLayout').html());
    $('.Xselect').change(function ()
    {
        var index = $(this).parent().val();
        switch ($(this).val() & 0xff00)
        {
        case 0x0200:
            $("#A-" + index).html('<input type="checkbox"/>');
            $("#T-" + index).html('<input type="checkbox"/>');
            $('#M-' + index).html('');
            break;
        case 0x0100:
            $("#A-" + index).html('');
            $("#T-" + index).html('');
            $('#M-' + index).html('');
            break;
        case 0x0800:
            $("#A-" + index).html('');
            $("#T-" + index).html('');
            $('#M-' + index).addClass('MSelect').html('<select class="XMSelect"></select>');
            option.Maps[index] = 0x0800;
            listMacro(option.Macro);
            break;
        default:
            $("#A-" + index).html('');
            $("#T-" + index).html('');
            $('#M-' + index).html('');
            break
        }
    })
}
function getValue(oc)
{
    for (var i = 0; i < dfMap.length; i++)
    {
        oc.Maps[i] = 0
    }
    $('.Xselect').each(function (index, element)
    {
        var index = $(this).parent().val();
        oc.Maps[index] = parseInt($(this).val());
        switch (oc.Maps[index] & 0xff00)
        {
        case 0x0200:
            if ($("#A-" + index + ' :checkbox').is(':checked'))
            {
                oc.Maps[index] |= 0x8000
            }
            if ($("#T-" + index + ' :checkbox').is(':checked'))
            {
                oc.Maps[index] |= 0x4000
            }
            break;
        case 0x0100:
            break;
        case 0x0800:
            oc.Maps[index] |= $('#M-' + index + ' select').val();
            break;
        default:
            break
        }
    });
    oc.Interval = $('#Interval').val();
    oc.Duration = $('#Duration').val()
}
function listMacro(macro)
{
    $('#XMacrolist').html('');
    $('.XMSelect').html('<option value="255">None</option>');
    for (var i in macro)
    {
        var li = $('<li></li>').appendTo('#XMacrolist');
        $('<a  class="share" href="#"   title="share"><img class="icon" style="vertical-align:middle;" src="misc/images/share.png" id="icon_newtable" alt="Create a new config"/> </a>').appendTo(li).data('index', i);
        $('<a  class="xmrename" href="#"   title="Rename"><img class="icon" style="vertical-align:middle;" src="misc/images/b_edit.png" id="icon_newtable" alt="Create a new config"/> </a>').appendTo(li).data('index', i);
        $('<a class="xmdelete" href="#"   title="delete"><img class="icon" style="vertical-align:middle;" src="misc/images/b_drop.png" id="icon_newtable" alt="Create a new config"/></a>').appendTo(li).data('index', i);
        $('<a  class="xmedit" href="#"   title="Edit">' + macro[i].name + '</a>').appendTo(li).data('index', i);
        $('<option value="' + i + '" title="' + macro[i].name + ':::' + macro[i].description + '">' + macro[i].name + '</option>').appendTo('.XMSelect')
    }
    $('.XMSelect').each(function ()
    {
        var index = $(this).parent().val();
        if ((option.Maps[index] & 0xf00) == 0x0800)
        {
            $(this).val(option.Maps[index] & 0xf)
        }
    });
    $('a.share').click(function ()
    {
        alert('share')
    });
    $('a.xmdelete').click(function ()
    {
        $('#del-confirm').data('index', $(this).data('index'));
        $("#del-confirm").dialog(
        {
            resizable: false,
            height: 120,
            modal: true,
            buttons: {
                "Delete": function ()
                {
                    option.Macro.splice($(this).data('index'), 1);
                    Display(option);
                    $(this).dialog("close")
                },
                Cancel: function ()
                {
                    $(this).dialog("close")
                }
            }
        })
    });
    $('a.xmrename').click(function ()
    {
        $('#xname').val(option.Macro[$(this).data('index')].name);
        $('#xdesc').val(option.Macro[$(this).data('index')].description);
        $('#xname').data('index', $(this).data('index'));
        $("#rename").dialog(
        {
            height: 260,
            width: 480,
            modal: true,
            buttons: {
                Ok: function ()
                {
                    option.Macro[$('#xname').data('index')].name = $('#xname').val();
                    option.Macro[$('#xname').data('index')].description = $('#xdesc').val();
                    Display(option);
                    $(this).dialog("close")
                },
                Cancel: function ()
                {
                    $(this).dialog("close")
                }
            }
        });
        return false
    });
    $('a.xmedit').click(function ()
    {
        $('#XMacroEditor').mij_MacroEditor(
        {
            GrainSize: 9,
            Macro: macro[$(this).data('index')]
        });
        $("#XinputMacro").dialog(
        {
            height: 360,
            width: 760,
            modal: false,
            buttons: {
                Ok: function ()
                {
                    $(this).dialog("close")
                }
            }
        });
        return false
    })
}
function listConfig(ops)
{
    $('#inputlist').html('');
    var tindex = 0;
    var Sindex = MIJconfig['inputIndex'];
    for (var i in ops)
    {
        var li = $('<li></li>').appendTo('#inputlist');
        $('<a  class="xrename" href="#"   title="Rename"><img class="icon" style="vertical-align:middle;" src="misc/images/b_edit.png" id="icon_newtable" alt="Create a new config"/> </a>').appendTo(li).data('index', i);
        $('<a class="xdelete" href="#"   title="delete"><img class="icon" style="vertical-align:middle;" src="misc/images/b_drop.png" id="icon_newtable" alt="Create a new config"/></a>').appendTo(li).data('index', i);
        $('<a  class="xedit tip" href="#"   title="click me to select and edit">' + ops[i].name + '</a>').appendTo(li).appendTo(li).data('index', i)
    }
    $('a.xdelete').click(function ()
    {
        $('#del-confirm').data('index', $(this).data('index'));
        if (ops.length > 1)
        {
            $("#del-confirm").dialog(
            {
                resizable: false,
                height: 120,
                modal: true,
                buttons: {
                    "Delete": function ()
                    {
                        try
                        {
                            if (Sindex[tindex] == $(this).data('index') || Sindex[tindex] == (ops.length - 1))
                            {
                                Sindex[tindex] = 0
                            }
                            ops.splice($(this).data('index'), 1);
                            option = ops[Sindex[tindex]];
                            listConfig(ops);
                            Display(option);
                            $(this).dialog("close")
                        }
                        catch (err)
                        {
                            DisplayMessage(err.description)
                        }
                    },
                    Cancel: function ()
                    {
                        $(this).dialog("close")
                    }
                }
            })
        }
        else
        {
            $("#del-forbid").dialog(
            {
                height: 120,
                width: 240,
                modal: true,
                buttons: {
                    Ok: function ()
                    {
                        $(this).dialog("close")
                    }
                }
            })
        }
        return false
    });
    $('a.xrename').click(function ()
    {
        $('#xname').val(ops[$(this).data('index')].name);
        $('#xdesc').val(ops[$(this).data('index')].description);
        $('#xname').data('index', $(this).data('index'));
        $("#rename").dialog(
        {
            height: 260,
            width: 480,
            modal: true,
            buttons: {
                Ok: function ()
                {
                    ops[$('#xname').data('index')].name = $('#xname').val();
                    ops[$('#xname').data('index')].description = $('#xdesc').val();
                    listConfig(ops);
                    $(this).dialog("close")
                },
                Cancel: function ()
                {
                    $(this).dialog("close")
                }
            }
        });
        return false
    });
    $('a.xedit').click(function ()
    {
        getValue(ops[Sindex[tindex]]);
        Sindex[tindex] = $(this).data('index');
        option = ops[Sindex[tindex]];
        Display(option);
        $('a.xedit').removeClass('listSelected');
        $(this).addClass('listSelected');
        return false
    });
    $('a.xedit').removeClass('listSelected');
    $('a.xedit').each(function (index, element)
    {
        if ($(this).data('index') == Sindex[tindex])
        {
            $(this).addClass('listSelected')
        }
    })
}(function ($)
{
    $.fn.mij_MacroEditor = function (settings)
    {
        var defaultSettings = {
            GrainSize: 9,
            Macro: undefined
        };
        var opts = $.extend(
        {}, defaultSettings, settings);
        var mstatus = new Array(opts.Macro.b1, opts.Macro.b2, opts.Macro.b3, opts.Macro.b4, opts.Macro.b5, opts.Macro.b6);
        $(this).html('<p style="color:#FFFF00 ">Duration<input type="input" id="MacroDuration" value="' + opts.Macro.duration + '" style="width:50px;text-align: right; vertical-align: middle; " />*millisecond Grain Size<input type="input" id="MacroGrainSize" value="9" style="width:50px;text-align: right; vertical-align: middle; " />PX</p><div id="XMacroEditBar"></div>');
        $('#MacroGrainSize').spin(
        {
            interval: 1,
            min: 1,
            max: 20,
            beforeChange: function (n, o)
            {
                opts.GrainSize = n;
                render(this)
            }
        });
        $('#MacroDuration').spin(
        {
            interval: 800,
            min: 800,
            max: 102400,
            changed: function (n, o)
            {
                opts.Macro.duration = n;
                render(this)
            }
        });
        var render = function (obj)
        {
            $('#XMacroEditBar').html('');
            for (var i = 0; i < mstatus.length; i++)
            {
                var html = '<div class="XinputMacroBar" style="width:' + (opts.Macro.duration / 100 * (parseInt(opts.GrainSize) + 1) + 80) + 'px;"><div id="mcommand' + i + '" class="XinputMacroBarButtonName" data-index="' + i + '">' + $('#MacroButtons').html() + '</div>';
                for (var j = 0; j < (opts.Macro.duration / 800); j++)
                {
                    if (mstatus[i][j] == undefined)
                    {
                        mstatus[i][j] = 0
                    }
                    for (var k = 0; k < 8; k++)
                    {
                        var time = j * 800 + k * 100 + 100;
                        if ((mstatus[i][j] & (0x01 << k)) == 0)
                        {
                            html += '<div class="XinputMacroBarPoint" data-press="0" data-row="' + i + '" data-indexbyte="' + j + '" data-indexbit="' + k + '" title="' + time + 'ms" style="width:' + opts.GrainSize + 'px;"></div>'
                        }
                        else
                        {
                            html += '<div class="XinputMacroBarPoint" data-press="1" data-row="' + i + '\" data-indexbyte="' + j + '" data-indexbit="' + k + '" title="' + time + 'ms" style="width:' + opts.GrainSize + 'px;background-color:#ff0000;"></div>'
                        }
                    }
                }
                $(html).appendTo('#XMacroEditBar');
                $('#mcommand' + i + ' select').val('0x' + (opts.Macro.command[i]).toString(16))
            }
            $('.McommandSelect').change(function ()
            {
                opts.Macro.command[$(this).parent().data('index')] = parseInt($(this).val())
            });
            $(".XinputMacroBarPoint").bind('click', function ()
            {
                if ($(this).data('press') == 0)
                {
                    $(this).data('press', 1);
                    $(this).css("background-color", "#FF0000");
                    mstatus[$(this).data('row')][$(this).data('indexbyte')] |= 0x01 << $(this).data('indexbit')
                }
                else
                {
                    $(this).data('press', 0);
                    $(this).css("background-color", "#cccccc");
                    mstatus[$(this).data('row')][$(this).data('indexbyte')] &= ~ (0x01 << $(this).data('indexbit'))
                }
            })
        };
        var mouseDwon = 0;
        $(this).parent().mousedown(function ()
        {
            mouseDwon = 1
        });
        $(this).parent().mouseup(function ()
        {
            mouseDwon = 0
        });
        render(this)
    }
})(jQuery);

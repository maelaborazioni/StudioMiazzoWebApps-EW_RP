customProperties:"methods:{\
onSortCmdMethodID:{\
arguments:null,\
parameters:null\
}\
}",
dataSource:"db:/ma_anagrafiche/lavoratori_giustificativitesta",
extendsID:"3C076162-6D45-4034-9F27-2ADA00E4841B",
items:[
{
dataProviderID:"giorno_al",
editable:false,
format:"dd/MM/yyyy|mask",
horizontalAlignment:0,
location:"150,20",
name:"fld_al_giorno",
onRightClickMethodID:"44206A25-B445-4DEF-AAC4-186EFC1B306F",
size:"150,20",
styleClass:"table",
transparent:true,
typeid:4,
uuid:"17E9A4C5-8A10-4C11-9817-8FC452C2CFEC"
},
{
height:480,
partType:5,
typeid:19,
uuid:"32308564-B45A-479E-80FA-4F0F80C5724D"
},
{
dataProviderID:"lavoratori_giustificativitesta_to_lavoratori_giustificativirighe.giornointero",
displayType:4,
editable:false,
horizontalAlignment:0,
location:"450,20",
name:"fld_giorno_intero",
onRightClickMethodID:"44206A25-B445-4DEF-AAC4-186EFC1B306F",
size:"80,20",
styleClass:"table",
transparent:true,
typeid:4,
uuid:"5F7D93DB-6E26-4D75-906D-6A05527A7AA8"
},
{
dataProviderID:"datarichiesta",
editable:false,
format:"dd/MM/yyyy",
horizontalAlignment:0,
location:"300,20",
name:"fld_richiesto_il",
onRightClickMethodID:"44206A25-B445-4DEF-AAC4-186EFC1B306F",
size:"150,20",
styleClass:"table",
transparent:true,
typeid:4,
uuid:"683A104A-D7E7-4268-AF6A-BD4A97709EB9"
},
{
dataProviderID:"approvatoil",
editable:false,
format:"dd/MM/yyyy",
horizontalAlignment:0,
location:"305,94",
name:"fld_gestito_il",
onRightClickMethodID:"-1",
size:"100,20",
styleClass:"table",
transparent:true,
typeid:4,
uuid:"818221FF-26EE-4A8C-8EC2-F1941ACD25FA",
visible:false
},
{
horizontalAlignment:0,
labelFor:"fld_gestito_da",
location:"530,0",
name:"lbl_gestito_da",
size:"370,20",
styleClass:"table_header",
text:"In carico a",
typeid:7,
uuid:"88825A7B-8F50-4E6D-9409-23E8E7EB3CBE"
},
{
horizontalAlignment:0,
labelFor:"fld_gestito_il",
location:"305,74",
name:"lbl_gestito_il",
size:"100,20",
styleClass:"table_header",
text:"Gestito il",
typeid:7,
uuid:"99760258-2EAD-4869-A068-DFE348821077",
visible:false
},
{
dataProviderID:"gestitoda",
editable:false,
horizontalAlignment:0,
location:"530,20",
name:"fld_gestito_da",
onRightClickMethodID:"44206A25-B445-4DEF-AAC4-186EFC1B306F",
size:"370,20",
styleClass:"table",
transparent:true,
typeid:4,
uuid:"9DD27039-B0A2-4D3D-B890-8E0C796F4045"
},
{
horizontalAlignment:0,
labelFor:"fld_al_giorno",
location:"150,0",
name:"lbl_al_giorno",
size:"150,20",
styleClass:"table_header",
text:"Al giorno",
typeid:7,
uuid:"AAA04EDD-B523-4211-8142-4D8CE2EBD0DF"
},
{
horizontalAlignment:0,
labelFor:"fld_richiesto_il",
location:"300,0",
name:"lbl_richiesto_il",
size:"150,20",
styleClass:"table_header",
text:"Richiesto il",
typeid:7,
uuid:"B752B97D-519F-44AD-B369-D1357882AE02"
},
{
dataProviderID:"giorno_dal",
editable:false,
format:"dd/MM/yyyy|mask",
horizontalAlignment:0,
location:"0,20",
name:"fld_dal_giorno",
onRightClickMethodID:"44206A25-B445-4DEF-AAC4-186EFC1B306F",
size:"150,20",
styleClass:"table",
transparent:true,
typeid:4,
uuid:"BF10C761-A0A0-4AD5-A213-A54673480979"
},
{
horizontalAlignment:0,
labelFor:"fld_dal_giorno",
location:"0,0",
name:"lbl_dal_giorno",
size:"150,20",
styleClass:"table_header",
text:"Dal giorno",
typeid:7,
uuid:"C7A23DC5-C8FF-4CDB-9038-C7AC6175E2FF"
},
{
horizontalAlignment:0,
labelFor:"fld_giorno_intero",
location:"450,0",
name:"lbl_giorno_intero",
size:"80,20",
styleClass:"table_header",
text:"Giorno intero",
typeid:7,
uuid:"DFAE5FA1-CD5B-486E-B62E-E62974345465"
},
{
extendsID:"AAAC08F8-0270-4E48-995F-E7066E036521",
height:40,
typeid:19,
uuid:"E83445CE-1703-4F53-9D51-C5FA8AF4E5B5"
}
],
name:"rp_gestione_richieste_da_evadere_tbl",
onRecordSelectionMethodID:"FF51FCFB-9487-4DD5-93D7-D7D1254E6433",
onShowMethodID:"549A6550-F32F-4CC7-9608-E71D27B69760",
onSortCmdMethodID:"9BAD947A-65A8-4772-BE38-46625D56C2CA",
scrollbars:0,
size:"900,480",
styleName:"leaf_style",
typeid:3,
uuid:"89BDFE90-E7AA-40AF-B4AA-2DFF5D1346D1",
view:3
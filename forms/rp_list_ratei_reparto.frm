dataSource:"db:/ma_anagrafiche/ditte",
extendsID:"E1B6951E-8C22-4464-9B19-707548D2B2DE",
items:[
{
anchors:3,
location:"760,5",
name:"btn_first",
onActionMethodID:"9FF26622-22E8-4432-ADB1-A22A1BFAA1DE",
rolloverCursor:12,
showClick:false,
size:"30,30",
styleClass:"btn_first",
toolTipText:"Vai alla prima pagina",
transparent:true,
typeid:7,
uuid:"0AFB2C30-69FD-4B02-8A8D-FC2552B2633F"
},
{
location:"500,5",
name:"btn_refresh",
onActionMethodID:"37CF4141-5CD7-4E29-B749-BFD80F4B88C5",
rolloverCursor:12,
showClick:false,
size:"30,30",
styleClass:"btn_refresh",
toolTipText:"Aggiorna i dati",
transparent:true,
typeid:7,
uuid:"0FE6BA70-2750-468C-B7C7-67AEBC47D210"
},
{
anchors:3,
location:"935,5",
name:"btn_next",
onActionMethodID:"1AECD268-5B62-4C42-9A74-D192C9DD982E",
rolloverCursor:12,
showClick:false,
size:"30,30",
styleClass:"btn_next",
toolTipText:"Vai alla pagina successiva",
transparent:true,
typeid:7,
uuid:"13C5175B-D3F4-4E8E-AFF4-B7E6F2CE0EB5"
},
{
anchors:3,
dataProviderID:"pages",
horizontalAlignment:0,
location:"885,10",
name:"lbl_totale_pagine",
size:"40,20",
transparent:true,
typeid:7,
uuid:"160D6625-02F7-40D1-9359-C4FE121D2C84"
},
{
anchors:9,
imageMediaID:"218E8864-159D-4DB1-8ABA-2B22F2C9546F",
location:"40,505",
name:"btn_browse",
onActionMethodID:"F2513922-D3A1-4D15-80DB-BB723761EE33",
rolloverCursor:12,
showClick:false,
size:"30,30",
toolTipText:"Annulla modifica dei parametri",
transparent:true,
typeid:7,
uuid:"5A9FF787-6E77-43D5-ADAB-C93149B36857",
visible:false
},
{
dataProviderID:"limitaAl",
format:"dd/MM/yyyy|mask",
location:"85,10",
name:"fld_al",
onDataChangeMethodID:"40AD4FA0-C66D-4D16-BD5A-BE15BD2B72FD",
size:"88,20",
typeid:4,
uuid:"663A70C4-EE05-4B9D-BE04-4CB53BFB61DF"
},
{
height:500,
partType:5,
typeid:19,
uuid:"6B0E0BBA-5CCE-4202-AACB-25E1799E3B2B"
},
{
anchors:3,
location:"965,5",
name:"btn_last",
onActionMethodID:"D5EE02A2-4F5F-4473-9BC3-5AF85D568609",
rolloverCursor:12,
showClick:false,
size:"30,30",
styleClass:"btn_last",
toolTipText:"Vai all'ultima pagina",
transparent:true,
typeid:7,
uuid:"6EBA4606-3BE4-42EB-84DD-50F1F97FA27C"
},
{
formIndex:6,
location:"183,10",
name:"lbl_gruppo",
size:"50,20",
text:"Gruppo",
transparent:true,
typeid:7,
uuid:"72035CE3-C847-44C9-9E61-36C4066C2962"
},
{
anchors:12,
formIndex:1,
location:"0,375",
margin:"0,2,0,0",
name:"lbl_ratei_reparto_riepilogo",
size:"121,20",
styleClass:"title_text",
text:"Riepilogo reparto",
transparent:true,
typeid:7,
uuid:"7FEC8ABD-CD8D-4846-BDAF-01E98E6F8C5E"
},
{
anchors:9,
imageMediaID:"F4ABA68D-4018-443C-90DA-1137B3C192A7",
location:"5,505",
name:"btn_edit",
onActionMethodID:"4943FD72-D657-4F3C-AC5E-E8421640322B",
rolloverCursor:12,
showClick:false,
size:"30,30",
toolTipText:"Modifica i parametri",
transparent:true,
typeid:7,
uuid:"85FD90C3-07DD-4F26-9599-32B05090343D",
visible:false
},
{
anchors:3,
dataProviderID:"currPage",
editable:false,
horizontalAlignment:0,
location:"830,10",
name:"fld_curr_page",
onDataChangeMethodID:"86220145-A694-4D3A-BF44-3F3636A7B727",
size:"30,20",
typeid:4,
uuid:"94B469D3-8B19-4443-B411-8438A7144C11"
},
{
labelFor:"fld_al",
location:"153,10",
name:"btn_al",
onActionMethodID:"763FDDFF-2CFE-46E2-A447-E7F60173BC57",
rolloverCursor:12,
showClick:false,
showFocus:false,
size:"20,20",
styleClass:"btn_calendar",
transparent:true,
typeid:7,
uuid:"971D0235-2225-44DC-876C-D3736B2605B7"
},
{
imageMediaID:"B8E53DBC-34B2-4166-823A-6EDF8B3DE455",
location:"530,5",
name:"btn_print",
onActionMethodID:"E9B333A2-A930-45CE-9DAB-F3E7FE83F14B",
rolloverCursor:12,
showClick:false,
size:"30,30",
styleClass:"btn_print",
toolTipText:"Aggiorna i dati",
transparent:true,
typeid:7,
uuid:"B15EDAC5-346F-4DDC-9B88-DA4000E44E7E"
},
{
anchors:14,
location:"0,375",
name:"lbl_ratei_reparto_riepilogo_header",
size:"1000,20",
styleClass:"title_bar",
typeid:7,
uuid:"B75C7D36-3DE4-4F83-AF78-D7945DCF7B62"
},
{
anchors:14,
formIndex:8,
location:"0,395",
name:"tab_ratei_reparto_riepilogo",
printable:false,
size:"1000,100",
tabOrientation:-1,
transparent:true,
typeid:16,
uuid:"CACFDDDC-25C6-49EE-A5BA-84FB6F901CF8"
},
{
anchors:3,
location:"790,5",
name:"btn_prev",
onActionMethodID:"9F347EDB-537E-47DC-9CEB-965033729F11",
rolloverCursor:12,
showClick:false,
size:"30,30",
styleClass:"btn_previous",
toolTipText:"Vai alla pagina precedente",
transparent:true,
typeid:7,
uuid:"D1AEB0B7-12D6-4803-9B38-89E251DD4DDE"
},
{
anchors:15,
formIndex:1,
location:"0,40",
name:"tab_ratei_reparto",
printable:false,
scrollTabs:true,
size:"1000,325",
tabOrientation:-1,
transparent:true,
typeid:16,
uuid:"D4F94AEB-8727-4366-B76A-E662CCA33BB9"
},
{
anchors:3,
horizontalAlignment:0,
location:"865,10",
name:"lbl_pagina_di",
size:"20,20",
text:"di",
transparent:true,
typeid:7,
uuid:"D6497810-9D7D-4041-8FC8-6911E9ABB33C"
},
{
anchors:15,
fontType:"Arial Rounded MT Bold,0,16",
horizontalAlignment:0,
location:"0,229",
name:"lbl_nessun_dipendente",
size:"1000,20",
text:"Nessun dipendente per il reparto nel periodo selezionato",
transparent:true,
typeid:7,
uuid:"D8D4E2BB-51DF-4BDA-A1B4-BCA8BF85D3F1"
},
{
dataProviderID:"vOptGruppoId",
displayType:2,
editable:false,
formIndex:7,
location:"233,10",
name:"fld_gruppo",
size:"240,20",
typeid:4,
uuid:"ED878EB3-C44D-46AB-9F41-364E6B6CA0D1",
valuelistID:"A54AEC31-A5D6-4B71-AA15-03A400B95202"
},
{
labelFor:"fld_al",
location:"10,10",
name:"lbl_dal",
size:"75,20",
text:"Situazione al",
transparent:true,
typeid:7,
uuid:"EEFD938D-E23A-4A6A-8237-9E080A02AA02"
}
],
name:"rp_list_ratei_reparto",
onShowMethodID:"1DFBF3D1-F429-45C7-82B9-8DC3E20C547E",
showInMenu:true,
size:"1000,500",
styleName:"leaf_style",
typeid:3,
uuid:"00411594-912D-43C0-8544-D926BC42BFF7"
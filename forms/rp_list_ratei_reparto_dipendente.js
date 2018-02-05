/** @type {JSDataSet}
 *
 * @properties={typeid:35,uuid:"22948BDE-1127-4F18-B912-5D04D3B27B57",variableType:-4}
 */
var dsRateiDip = null;

/**
 * Prepara il recupero dei dati e la situazione dei ratei del lavoratore alla data selezionata
 * 
 * @param {Number} idLavoratore
 * @param {Date} al
 * @param {Boolean} [proiezioneRatei]
 *
 * @properties={typeid:24,uuid:"4FBEEBA1-A11F-4A73-A7BC-12D05C62C7D8"}
 * @SuppressWarnings(unused)
 */
function preparaSituazioneRateiLavoratore(idLavoratore,al,proiezioneRatei)
{
	var _vFormName = controller.getName() + '_' + idLavoratore;
	var vDatasetRateiDip = globals.ottieniDataSetRateiDip(idLavoratore,
    	                                                  al,
														  true,
														  proiezioneRatei);    
    var vDataSourceRateiDip = vDatasetRateiDip.createDataSource('vDataSourceRateiDipReparto_' + idLavoratore);
	    
		if(elements.tab_ratei_dip)
		   elements.tab_ratei_dip.removeAllTabs();
		
		if(history.removeForm(_vFormName))	
	       solutionModel.removeForm(_vFormName);
		
		solutionModel.cloneForm(_vFormName, solutionModel.getForm('agl_ratei_tbl'));
		solutionModel.getForm(_vFormName).styleName = 'leaf_style_table';
		solutionModel.getForm(_vFormName).dataSource = vDataSourceRateiDip;
	    solutionModel.getForm(_vFormName).getField('descrizione').dataProviderID = 'Descrizione';
	    solutionModel.getForm(_vFormName).getField('anni_precedenti').dataProviderID = 'Residuo2AP';
	    solutionModel.getForm(_vFormName).getField('residuo_iniziale').dataProviderID = 'ResiduoAnnoPrec';
	    solutionModel.getForm(_vFormName).getField('maturato_anno').dataProviderID = 'MaturatoAnno';
	    solutionModel.getForm(_vFormName).getField('accantonate').dataProviderID = 'Accantonate';
	    solutionModel.getForm(_vFormName).getField('goduto_anno').dataProviderID = 'GodutoAnno';
	    solutionModel.getForm(_vFormName).getField('liquidato_anno').dataProviderID = 'LiquidatoAnno';	
	    solutionModel.getForm(_vFormName).getField('residuo').dataProviderID = 'Residuo';
	    
	    if(proiezioneRatei)
	    {
	    	elements.lbl_disclaimer.visible = true;
		    solutionModel.getForm(_vFormName).getField('damaturare').dataProviderID = 'DaMaturare';
		    solutionModel.getForm(_vFormName).getField('residuofinematurazione').dataProviderID = 'ResiduoFineMaturazione';
		    solutionModel.getForm(_vFormName).getField('periodofinematurazione').dataProviderID = 'PeriodoFineMaturazione';
	    }
	    
	    forms[_vFormName].elements['damaturare'].visible =
	    forms[_vFormName].elements['residuofinematurazione'].visible =
	    forms[_vFormName].elements['periodofinematurazione'].visible = proiezioneRatei;
	    
	 	elements.tab_ratei_dip.addTab(_vFormName);
	    	
}



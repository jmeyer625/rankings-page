$(function (){

	var createSelect = function(rankingsData){
		var selectSource = $('#createFilterOptions').text();
		var selectTemplate = Handlebars.compile(selectSource);
		$('form').prepend(selectTemplate(rankingsData));
	}

	var updateTable = function(pageNumber, dataObj){
		var pageIndex = pageNumber-1;
		var renderData = {
			cols: dataObj.cols,
			data: dataObj[pageIndex]
		};
		var tableSource = $('#createTable').text();
		var tableTemplate = Handlebars.compile(tableSource);
		$('#mainContainer').html(tableTemplate(renderData));
	}

	var generatePageNumberObject = function(number){
		var pageArray = [];
		for (var i=0; i<number; i++) {
			pageArray.push(i+1);
		}
		return {arr:pageArray}
	}
	
	var groupData = function(origData, size){
		var numPages = origData.data.length%size ? Math.floor(origData.data.length/size)+1 : Math.floor(origData.data.length/size)
		var groupedData = {}
		for(var i=0; i<numPages; i++) {
			var newArray = [];
			for(var j=i*20; j<(i+1)*20; j++) {
				if(j>=origData.data.length) {
					break;
				}
				newArray.push(origData.data[j]);
			}
		groupedData[i]=newArray;
		}
		groupedData['cols']=origData.cols;
		groupedData.numPages=numPages;
		return groupedData;
	}

	var filterDataText = function(selection) {
		var filterIndex = rankingsData.cols.indexOf($('#filterSelect').val());
		var filteredData = _.filter(rankingsData.data,function(item){
			return (item[filterIndex].toLowerCase().indexOf(selection.toLowerCase()) !== -1)
		});
		var newData = {};
		newData.cols = rankingsData.cols;
		newData.data = filteredData;
		currentData = groupData(newData,20);
		updateTable(1,currentData);
		updatePagination(currentData);
	}

	// var sortData = function(data,parameter) {
	// 	var sortIndex = data.cols.indexOf($('#sortSelect').val());
	// 	var sortedData = _.sort(data,function(arr){
	// 		return arr[sortIndex]===parameter;
	// 	}
	// }
	
	var updatePagination = function(data) {
		var pageObject = generatePageNumberObject(data.numPages);
		var paginationSource = $('#createPagination').text();
		var paginationTemplate = Handlebars.compile(paginationSource);
		$('.pagination').html(paginationTemplate(pageObject));
	}

	var renderPage = function(data,sortParam,filterParam,page) {
		var page = page || 1;

	}

	var init = function(pageSize) {
		var currentPage = 1;
		var groupedData = groupData(rankingsData, pageSize);
		updateTable(currentPage,groupedData);
		updatePagination(groupedData);
		createSelect(groupedData);
		return groupedData;
	}

	var currentData = init(20);
	var currentPage = 1;
	var tableSource = $('#createTable').text();
		var tableTemplate = Handlebars.compile(tableSource);

	$(document).on('click','.page-number',function(){
		var newPage = parseInt($(this).text())
		updateTable(newPage, currentData);
		currentPage = newPage;

	})

	$(document).on('click','#first',function(){
		updateTable(1,currentData);
		currentPage = 1;
	})

	$(document).on('click','#last',function(){
		updateTable(currentData.numPages,currentData);
		currentPage = currentData.numPages;
	})

	$(document).on('click','#next',function(){
		if (currentPage < currentData.numPages){
			updateTable(currentPage+1,currentData);
			currentPage += 1;
		}
	})


	$(document).on('click','#prev',function(){
		if (currentPage-1>0){
			updateTable(currentPage-1,currentData);
			currentPage -= 1;
		}
	})


	$('#filterInput').keyup(function(){
		filterDataText($(this).val(),rankingsData);
	})



})
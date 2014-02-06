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
			data: dataObj.pageData[pageIndex]
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
	
	var getPages = function(data, pageSize){
		var numPages = data.showData.length%pageSize ? Math.floor(data.showData.length/pageSize)+1 : Math.floor(data.showData.length/pageSize)
		var pageArrays = [];
		for(var i=0; i<numPages; i++) {
			var newArray = [];
			for(var j=i*pageSize; j<(i+1)*pageSize; j++) {
				if(j>=data.data.length) {
					break;
				}
				newArray.push(data.showData[j]);
			}
			pageArrays.push(newArray);
		}
		data.numPages=numPages;
		return pageArrays;
	}

	var filterDataText = function(selection,data) {
		var filterIndex = rankingsData.cols.indexOf($('#filterSelect').val());
		data.showData = _.filter(rankingsData.data,function(item){
			return (item[filterIndex].toLowerCase().indexOf(selection.toLowerCase()) !== -1)
		});
		data.pageData = getPages(data, 20);
		updateTable(1,data);
		updatePagination(data);
	}

	var sortData = function(data,parameter) {
		var sortIndex = data.cols.indexOf(parameter);
		data.showData = _.sortBy(data.showData,function(arr){
			
			return arr[sortIndex];
		})
		data.pageData = getPages(data,20);
		return data;
	}
	
	
	var updatePagination = function(data) {
		var pageObject = generatePageNumberObject(data.numPages);
		var paginationSource = $('#createPagination').text();
		var paginationTemplate = Handlebars.compile(paginationSource);
		$('.pagination').html(paginationTemplate(pageObject));
	}

	var init = function(pageSize) {
		var currentPage = 1;
		rankingsData.showData = rankingsData.data;
		rankingsData.pageData = getPages(rankingsData, pageSize);
		updateTable(currentPage,rankingsData);
		updatePagination(rankingsData);
		createSelect(rankingsData);
		return rankingsData;
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

	$('#sort').click(function(e){
		e.preventDefault();
		rankingsData = sortData(rankingsData,$('#filterSelect').val());
		updateTable(1,rankingsData);
	})



})
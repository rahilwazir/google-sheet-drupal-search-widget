
var item_index = 1;
// var sheet_data;
let filter_items = "";
var max_items = 21;
var title = "";
var link = "";
var area_of_work = "";
var pdf_permalink = "";
var resourcetype = "";
var topic_area = "";
var who = "";
var date = "";
// For Funding Sheet
var type= "";
var eligibility_columns =[];
var topic_area_columns = [];
var type_columns = [];
var eligibility = "";
var eligibility_two = "";
var eligibility_three = "";
var eligibility_four = "";
let pagination_length = "";
let name_of_sheet = "";
var search_text = "";
var sheet_data_for_search = "";
var filter_data_array = [];
let area_of_work_checked_values = [];
let resource_type_checked_values = [];
let topic_area_checked_values = [];
let type_checked_values = [];
let eligibility_checked_values = [];
let all_filter_data = [];
// let filter_item = [];
let google_sheet = document.getElementById('google_sheet');
const html = `  <style>
                         .card{
                            border: none;
                         }
                        .p_items>p{
                            margin-bottom: 0px;
                        }          
                        h2{
                            font-family: "Trebuchet MS";
                            font-size: 16px;
                        }
                            
                        /*ul,li{*/
                        /*  font-family: "Trebuchet MS";*/
                        /*  font-size: 14px;*/
                        /*}*/
                          
                        .content_tab{
                            position:absolute;
                            /*width: 80%;*/
                            /*padding: 20px;*/
                        }
                        .page-item.active .page-link{
                            background-color: #164b83;
                            border: none;
                        }
                        .filter_heading{
                            width: auto;
                            background: lightgray;
                            padding: 10px;
                        }
                        li{
                            padding: 5px;
                        }
                        </style>
                    <div style="width: 100%; padding: 20px;" class="main_page container" id="main_page">
                    <div class="row">
                        <div class="col-md-3 col-lg-3 col-sm-12">
                        <div class="filters_tab">
                            <div id="filters" class="filters">
                              
                            </div>
                        </div>
                     </div>
                        <div class="col-md-9 col-lg-9 col-sm-12">
                        <div class="row">
                          <div class="col-md-11 col-sm-11 col-lg-11" style="width: 100%">
                            <label for="search_text" style="display: none;">Search Directory:</label>
                            <div class="input-group mb-3">
                                <input type="text" class="form-control" name="search_text" aria-label="search_text" id="search_text" placeholder="Directory Search" onkeyup="search_filter()" />
                            </div>
                          </div>
                          <div class="col-md-1 col-sm-12 col-lg-1">
                            <div class="input-group">
                            <button for="Search Directory" type="button" class="btn" role="button"  onclick="search_filter()" style="background: #1659a2; color: white;">Search</button>
                            </div>
                          </div>
                        </div>
                           <div class="" id="main_container" style="width: 100%">
                           <div class="row container_data" id="container_data">
                                
                             
                           </div>
                           <div class="row" style="justify-content: flex-end">
                               <nav aria-label="pagination_links" role="navigation">
                                    <ul class="pagination pagination_links" id="pagination_links">
                                    
                                    </ul>
                               </nav>
                            </div>
                           </div>
                        </div>
                    </div>
                </div> 
                `;


document.getElementById('google_sheet').innerHTML += `${html}`;


function sheet_data_from_api(filter_flag = null){

    const sheet_id = google_sheet.getAttribute('sheet_id');
    const sheet_name = google_sheet.getAttribute('sheet_name');
    const Api_Key = 'AIzaSyBJ5SKiHhY7ox9Wtxa-v2UQaPY6Psl6TJk';
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    var list_item = ""

    // let sheet_data = "";
    fetch("https://sheets.googleapis.com/v4/spreadsheets/"+sheet_id +"/values/"+sheet_name+"?dateTimeRenderOption=FORMATTED_STRING&majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE&key="+Api_Key, requestOptions)
        .then(response => response.json())
        .then(result => {


            // test = result.values;
            filter_items =  result.values[0];
            sheet_data = result.values;
            if(sheet_name == "Resources"){
                name_of_sheet = sheet_name;
                // set_resources_filter_items(result.values);
                set_dynamic_filters(sheet_id,sheet_name);
                result.values.shift();
                result.values.sort(customSort)
                set_sheet_data(result.values,sheet_name);
                generate_pagination(result.values.length);
            }

            if(sheet_name == "Funding"){

                name_of_sheet = sheet_name;
                // set_funding_filter_items(result.values,sheet_name);
                set_dynamic_filters(sheet_id,sheet_name);
                result.values.shift();
                result.values.sort(customSort)
                set_sheet_data(result.values,sheet_name);
                generate_pagination(result.values.length);
            }


        })
        .catch(error => {
            if(error){
                google_sheet.innerHTML = '';
                // alert('Failed To Load Widget');
            }
        });

}

sheet_data_from_api();

function set_dynamic_filters(sheet_id,sheet_name) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("https://sheets.googleapis.com/v4/spreadsheets/"+sheet_id+"/values/Read me?dateTimeRenderOption=FORMATTED_STRING&majorDimension=COLUMNS&valueRenderOption=FORMATTED_VALUE&key=AIzaSyC5Ri-uCSGtML5sNfjAv6bd8hfhDJk2v1o", requestOptions)
        .then(response => response.json())
        .then(result => {
            let result_data = result.values;
            let main_filters =  result_data.slice(0,5);

            let Area_of_work_filter = main_filters[0].slice(2);
            let Resource_type_filter = main_filters[1].slice(2);
            let Topic_area_filter = main_filters[2].slice(2);
            let Type_filter = main_filters[3].slice(2);
            let Eligibility_filter = main_filters[4].slice(2);
            let filters = {};
            if(sheet_name == "Funding"){
                filters  = {
                    Area_of_work_filter :Area_of_work_filter,
                    Topic_area_filter   :Topic_area_filter,
                    Type_filter :Type_filter,
                    Eligibility_filter  :Eligibility_filter,
                }

                set_funding_filter_items(filter_items,filters);
            }
            if(sheet_name == "Resources"){
                filters  = {
                    Area_of_work_filter :Area_of_work_filter,
                    Resource_type_filter   :Resource_type_filter,
                    Topic_area_filter :Topic_area_filter,
                }

                set_resources_filter_items(filter_items,filters);
            }
        })
        .catch(error => console.log('error', error));

}
function set_funding_filter_items(result = null,filters){
    let filter_items = "";
    filter_items =  result;
    let total_filters = [];
    let area_of_work_heading,resource_type,topic_area_heading;
    var filter_id = 0;
    let funding_filters = document.getElementById('filters');
    var area_of_work_filter_items,type_filter_items,topic_area_filter_items,eligibility_filter_items;
    // var area_of_work_filter_items,type_filter_items,topic_area_filter_items,eligibility;
    for (let i = 0; i<filter_items.length ; i++) {
        if(filter_items[i] == "Area of Work" || filter_items[i] == "Topic Area 1" || filter_items[i] == "Type 1" || filter_items[i] == "Eligibility 1"){
            total_filters.push(filter_items[i])
        }
    }

    total_filters[3] = "Eligibility";
    total_filters[1] = "Topic Area";
    total_filters[2] = "Type";
    funding_filters.innerHTML = "";
    for (let i = 0; i <total_filters.length; i++) {
        filter_id = i+1;
        funding_filters.innerHTML += `
                  <div class="">
                    <div class="card" style="margin-bottom:15px !important;">
                        <div class="card-header"  id="filterHeading${filter_id}" style="padding: 0px; !important; border-radius: none;">
                            <h2 class="mb-0 p-2" >
                            ${total_filters[i]}
                            </h2>
                        </div>
                
                        <div id="filterCollapse" class="">
                            <div class="card-body">
                                <ul style="list-style: none; padding: 0; margin-bottom: -1rem !important;" id="filter_${filter_id}">
                                    <!-- Your filter options go here -->
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>  
                `
    }

    const area_of_work_filter_uniq        = filters.Area_of_work_filter;
    const type_filter_uniq                = filters.Type_filter;
    const topic_area_filter_uniq          = filters.Topic_area_filter;
    const eligibility_filter_uniq         = filters.Eligibility_filter;

    area_of_work_filter_uniq.sort();
    type_filter_uniq.sort();
    topic_area_filter_uniq.sort();
    eligibility_filter_uniq.sort();
    area_of_work_filter_items = document.getElementById('filter_1');
    type_filter_items = document.getElementById('filter_3');
    topic_area_filter_items = document.getElementById('filter_2');
    eligibility_filter_items = document.getElementById('filter_4');
    // Area of Work Filter items
    area_of_work_filter_items.innerHTML = "";
    for (let i = 0; i <area_of_work_filter_uniq.length ; i++) {
        area_of_work_filter_items.innerHTML += `
                     <li style="width: 300px;">
                        <input type="checkbox" class="area_of_work_filter_item filter_items" value="${area_of_work_filter_uniq[i]}" id="filter_item_${i}" style="margin-left: -22px;" onclick="filter_item(${i})">
                        <label for="filter_item_${i}">${area_of_work_filter_uniq[i]}</label>
                    </li>
                    `
    }

    // Topic Area Filter items
    topic_area_filter_items.innerHTML = "";
    for (let i = 0; i <topic_area_filter_uniq.length; i++) {
        let j = i+area_of_work_filter_uniq.length;
        topic_area_filter_items.innerHTML += `
                  <li style="width: 300px;">
                    <input type="checkbox" class="topic_area_filter_item filter_items" value="${topic_area_filter_uniq[i]}" id="filter_item_${j}" style="margin-left: -22px;" onclick="filter_item(${j})">
                    <label for="filter_item_${j}">${topic_area_filter_uniq[i]}</label>
                  </li>
                    `
    }

    // Type  Filter items
    type_filter_items.innerHTML = "";
    for (let i = 0; i <type_filter_uniq.length; i++) {
        let j = i+topic_area_filter_uniq.length+area_of_work_filter_uniq.length;
        type_filter_items.innerHTML += `
                    <li style="width: 300px;">
                        <input type="checkbox" class="type_filter_item filter_items" value="${type_filter_uniq[i]}" id="filter_item_${j}" style="margin-left: -22px;" onclick="filter_item(${j})">
                        <label for="filter_item_${j}">${type_filter_uniq[i]}</label>
                    </li>
                    `
    }

    // Eligibility Filter items
    eligibility_filter_items.innerHTML = "";
    for (let i = 0; i <eligibility_filter_uniq.length; i++) {
        let j = i+type_filter_uniq.length+area_of_work_filter_uniq.length+topic_area_filter_uniq.length;
        eligibility_filter_items.innerHTML += `
                    <li style="width: 300px;">
                        <input type="checkbox" class="eligibility_filter_item filter_items" value="${eligibility_filter_uniq[i]}" id="filter_item_${j}" style="margin-left: -22px;" onclick="filter_item(${j})">
                        <label for="filter_item_${j}">${eligibility_filter_uniq[i]}</label>
                    </li>
                    `
    }


}
function set_resources_filter_items(result=null,filters=null){

    let filter_items = "";
    filter_items =  result;
    let area_of_work_heading,resource_type,topic_area_heading;
    let total_filters = [];
    let resource_sheet_filters = document.getElementById('filters');
    var filter_id = 0;
    var area_of_work_filter_items,resource_type_filter_items,topic_area_filter_items;
    for (let i = 0; i<filter_items.length; i++) {
        if(filter_items[i] == "Area of Work" || filter_items[i] == "Resource Type" || filter_items[i] == "Topic Area"){
            total_filters.push(filter_items[i]);
        }
    }
    resource_sheet_filters.innerHTML = "";
    for (let i = 0; i <total_filters.length ; i++) {
        filter_id = i+1;
        resource_sheet_filters.innerHTML += `
                  <div class="">
                    <div class="card" style="margin-bottom:15px !important;">
                        <div class="card-header"  id="filterHeading${filter_id}" style="padding: 0px; !important; border-radius: none;">
                            <h2 class="mb-0 p-2" >
                                 ${total_filters[i]}
                            </h2>
                        </div>
                
                        <div id="filterCollapse" class="">
                            <div class="card-body">
                                <ul style="list-style: none; padding: 0; margin-bottom: -1rem !important;" id="filter_${filter_id}">
                                    <!-- Your filter options go here -->
                                </ul>
                            </div>
                        </div>
                    </div>
                </div> 
                `
    }

    const area_of_work_filter_uniq = filters.Area_of_work_filter;
    const resource_type_filter_uniq = filters.Resource_type_filter;
    const topic_area_filter_uniq = filters.Topic_area_filter;
    area_of_work_filter_uniq.sort();
    resource_type_filter_uniq.sort();
    topic_area_filter_uniq.sort();
    area_of_work_filter_items = document.getElementById('filter_1');
    resource_type_filter_items = document.getElementById('filter_2');
    topic_area_filter_items = document.getElementById('filter_3');
    area_of_work_filter_items.innerHTML = "";
    // Area of Work Filter items
    for (let i = 0; i <area_of_work_filter_uniq.length ; i++) {
        area_of_work_filter_items.innerHTML += `
                        <li style="width: 300px;">
                            <input type="checkbox" class="area_of_work_filter_item filter_items" value="${area_of_work_filter_uniq[i]}" id="filter_item_${i}" style="margin-left: -22px;" onclick="filter_item(${i})">
                            <label for="filter_item_${i}">${area_of_work_filter_uniq[i]}</label>
                        </li>
                    `
    }

    // Resource Type Filter items
    resource_type_filter_items.innerHTML = "";
    for (let i = 0; i <resource_type_filter_uniq.length; i++) {
        let j = i+area_of_work_filter_uniq.length;
        resource_type_filter_items.innerHTML += `
                        <li style="width: 300px;">
                            <input type="checkbox" class="resource_type_filter_item filter_items" value="${resource_type_filter_uniq[i]}" id="filter_item_${j}" style="margin-left: -22px;" onclick="filter_item(${j})">
                            <label for="filter_item_${j}">${resource_type_filter_uniq[i]}</label>
                        </li>
                    `
    }

    // Topic Area Filter items
    topic_area_filter_items.innerHTML = "";
    for (let i = 0; i <topic_area_filter_uniq.length ; i++) {
        let j= i+area_of_work_filter_uniq.length+resource_type_filter_uniq.length;
        topic_area_filter_items.innerHTML += `
                        <li style="width: 300px;">
                            <input type="checkbox" class="topic_area_filter_item filter_items" value="${topic_area_filter_uniq[i]}" id="filter_item_${j}" style="margin-left: -22px;" onclick="filter_item(${j})">
                            <label for="filter_item_${j}">${topic_area_filter_uniq[i]}</label>
                        </li>
                    
                    `
    }

}


function set_eligibilty_columns_to_data(columns =  null){
    eligibility_columns = [];
    eligibility = "";

    for (let i = 0; i <columns.length ; i++) {
        // console.log(columns[i]);
        if(columns[i] != ''){
            eligibility_columns.push(columns[i]);
        }
    }
    let uniqueValues = [...new Set(eligibility_columns)];
    if(uniqueValues.length > 1){
        for (let i = 0; i <uniqueValues.length ; i++) {
            eligibility += `${i !== uniqueValues.length - 1 ? ' '+uniqueValues[i] + ',' : ' '+uniqueValues[i]}`;
        }
    }else if(uniqueValues.length == 1){
        for (let i = 0; i <uniqueValues.length; i++) {
            eligibility += `${' '+uniqueValues[i]}`;
        }
    }


    uniqueValues = [];
    return eligibility;
}

function set_topic_area_columns_to_data(columns = null){

    topic_area_columns = [];
    topic_area = "";
    if(columns.length > 0){
        for (let i = 0; i <columns.length; i++) {
            if(columns[i] != ''){
                topic_area_columns.push(columns[i]);
            }
        }
    }
    let uniqueValues = [...new Set(topic_area_columns)];
    if(uniqueValues.length > 1){
        for (let i = 0; i <uniqueValues.length ; i++) {
            topic_area += `${i !== uniqueValues.length - 1 ? ' '+uniqueValues[i] + ',' : ' '+uniqueValues[i]}`;
        }
    }else if(uniqueValues.length == 1){
        for (let i = 0; i <uniqueValues.length; i++) {
            topic_area += `${' '+uniqueValues[i]}`;
        }
    }
    uniqueValues = [];
    return topic_area;
}

function set_type_columns_to_data(columns = null){
    type_columns = [];
    type = '';
    if(columns.length > 0){
        for (let i = 0; i <columns.length ; i++) {
            if(columns[i] != ''){
                type_columns.push(columns[i]);
            }
        }
    }
    // console.log(type_columns)
    let uniqueValues = [...new Set(type_columns)];
    if(uniqueValues.length > 1){
        for (let i = 0; i <uniqueValues.length ; i++) {
            type += `${i !== uniqueValues.length - 1 ? ' '+uniqueValues[i] + ',' : ' '+uniqueValues[i]}`;
        }
    }else if(uniqueValues.length == 1){
        for (let i = 0; i <uniqueValues.length; i++) {
            type += `${' '+uniqueValues[i]}`;
        }
    }
    uniqueValues = [];
    return type;
}

function set_sheet_data(result,sheet_name= ""){
    let container_data = document.getElementById('container_data');

    container_data.innerHTML = "";
    if (result.length > 0){
        // Pagination
        for (let i= 0; i<max_items; i++) {
            if((i == max_items) || (result.length == i)){
                break;
            }else{

                for (let j = 0; j <result[i].length ; j++) {
                    if (result[i][0] != ""){
                        title = result[i][0];
                    }
                    else{
                        title = "not available";
                    }
                    if(result[i][1] !=  ""){
                        link  = result[i][1];
                    }else {
                        link = "not available";
                    }
                    if(name_of_sheet == "Resources"){
                        if(result[i][2] != ""){
                            pdf_permalink = result[i][2];
                        }
                        else{
                            pdf_permalink = "not available";
                        }
                        if(result[i][3] != ""){
                            area_of_work = result[i][3];
                        }else {
                            area_of_work = "not available"
                        }
                        if(result[i][4] != ""){
                            resourcetype = result[i][4];
                        }else{
                            resourcetype = "not available"
                        }
                        if(result[i][5] != ""){
                            topic_area = result[i][5];
                        }else{
                            topic_area = "not available";
                        }
                        if(result[i][6] != "" ){
                            who = result[i][6];
                        }else{
                            who = "not available";
                        }
                    }
                    if(name_of_sheet == "Funding"){
                        if(result[i][2] != ""){
                            area_of_work = result[i][2];
                        }else {
                            area_of_work = "not available"
                        }
                        // if(result[i][3] != ""){
                        //     topic_area = result[i][3];
                        // }else{
                        //     topic_area = "not available";
                        // }
                        if(result[i][5] != ""){
                            type = result[i][5];
                        }else{
                            type = "not available";
                        }
                        if(result[i][6] != "" ){
                            eligibility = result[i][6];
                        }else{
                            eligibility = "not available";
                        }
                        if(result[i][7] != "" ){
                            eligibility_two = result[i][7];
                        }else{
                            eligibility_two = "not available";
                        }
                        if(result[i][8] != "" ){
                            eligibility_three = result[i][8];
                        }else{
                            eligibility_three = "not available";
                        }
                        if(result[i][9] != "" ){
                            eligibility_four = result[i][9];
                        }else{
                            eligibility_four = "not available";
                        }
                    }

                }
            }
            if(name_of_sheet == "Resources"){
                container_data.innerHTML += `
                                       <div class="col-md-4 col-sm-12 col-lg-4 mb-2">
                                           <div class="card" >
                                             <div class="card-body">
                                                  <a href="${link}" target="_blank" class="links" style="color: #1659a2;" tabindex="${i+1}"><h5 class="card-title">${title}</h5></a>
                                                  <div class="p_items">
                                                    <p tabindex="${i+1}"><span style="font-weight: 500">Area of  work</span>: ${area_of_work === undefined ? ' - ' : area_of_work}</p>
                                                    <p tabindex="${i+1}"><span style="font-weight: 500">Resource Type</span>: ${resourcetype === undefined ? ' - ' : resourcetype}</p>
                                                    <p tabindex="${i+1}"><span style="font-weight: 500">Topic Area</span>: ${topic_area   === undefined ? ' - ' : topic_area}</p>
                                                  </div>
                                                </div>
                                           </div>
                                       </div>
                                `
            }
            if(name_of_sheet == "Funding"){
                set_topic_area_columns_to_data(result[i].slice(3,10));
                set_type_columns_to_data(result[i].slice(11,19));
                set_eligibilty_columns_to_data(result[i].slice(19,33));
                container_data.innerHTML += `
                   <div class="col-md-4 col-sm-12 col-lg-4 mb-2">
                       <div class="card" >
                             <div class="card-body">
                                  <a href="${link}" target="_blank" class="links" style="color: #1659a2;" tabindex="${i+1}"><h5 class="card-title">${title}</h5></a>
                                  <div class="p_items" style="white-space: normal;">
                                    <p tabindex="${i+1}"><span style="font-weight: 500">Area of  work</span>: ${area_of_work === undefined ? ' - ' : area_of_work}</p>
                                    <p tabindex="${i+1}"><span style="font-weight: 500">Topic Area</span>: ${topic_area === undefined ? ' - ' : topic_area == '' ? ' - ' : topic_area}</p>
                                    <p tabindex="${i+1}"><span style="font-weight: 500">Type</span>: ${type   === undefined ? ' - ' : type == '' ? ' - ' : type}</p>
                                    <p style="" tabindex="${i+1}"><span style="font-weight: 500">Eligibility</span>:${eligibility}</p>
                                  </div>
                             </div>
                       </div>
                   </div>
                                `
            }

        }

    }

}

let page_iteration = 1;
function generate_pagination(data_length = null,filter_flag=false){

    pagination_length = Math.ceil(Number(data_length/max_items));
    var pagination_links = document.getElementById('pagination_links');
    pagination_links.innerHTML = "";
    pagination_links.innerHTML = `
                    <li class="page-item disabled" id="previous_page" onclick="previous_page()">
                      <a class="page-link" href="#main_page">Previous</a>
                    </li>
                    `;
    if (filter_flag == false){
        for (let i = 1; i <pagination_length+1; i++) {
            pagination_links.innerHTML += `
                            <li class="page-item ${i == 1 ? 'active' : ''}" id="page_nav_link_${i}" onclick="active_page_link(${i})"  index="${i}" >
                                  <a class="page-link" style="" href="#main_page">${i}</a>
                            </li>
                        `;
        }
    }else{
        for (let i = 1; i <pagination_length+1; i++) {
            pagination_links.innerHTML += `
                            <li class="page-item ${i == 1 ? 'active' : ''}" id="page_nav_link_${i}" onclick="filter_page_link(${i})"  index="${i}" >
                                  <a class="page-link" style="" href="#main_page">${i}</a>
                            </li>
                        `;
        }
    }

    pagination_links.innerHTML += `
                    <li class="page-item" id="next_page" onclick="next_page()">
                      <a class="page-link" href="#main_page">Next</a>
                    </li>
                    `;
}
function next_page(){

    if (page_iteration > 1){
        document.getElementById('previous_page').classList.remove('disabled');
    }
    if(page_iteration == pagination_length){
        // document.getElementById('page_nav_link_'+pagination_length).classList.add('active')
        document.getElementById('next_page').classList.add('disabled');
    }else{
        page_iteration = page_iteration +1;
    }
    active_page_link(page_iteration);
}
function previous_page(){

    if (page_iteration == 1){
        document.getElementById('previous_page').classList.add('disabled');
        active_page_link(page_iteration);
    }
    else if (page_iteration > 1){
        page_iteration = page_iteration-1;
        active_page_link(page_iteration);
    }

}
function filter_page_link(iteration){
    const pagination_links =  document.querySelectorAll('.page-item');
    pagination_links.forEach(link => link.classList.remove('active'))
    document.getElementById('page_nav_link_'+iteration).classList.add('active');
    let start_index = (iteration - 1) * 20; // 20 items per page
    let end_index = start_index + 20;

    if (iteration === 1) {
        document.getElementById('previous_page').classList.add('disabled');
        start_index = 1;
        end_index = 21; // Start from 1 and end at 20 for the first page
    }else if(iteration >  1){
        page_iteration = iteration;
        document.getElementById('previous_page').classList.remove('disabled');
    }
    if (iteration == pagination_length){
        document.getElementById('next_page').classList.add('disabled');
    }else if(iteration < pagination_length){
        document.getElementById('next_page').classList.remove('disabled');
    }
    // Ensure the end_index doesn't go beyond the array length
    if (end_index > sheet_data.length) {
        end_index = sheet_data.length;
    }
    filter_data_array = all_filter_data;
    document.getElementById('container_data').innerHTML = '';
    for (let i = start_index; i <end_index; i++) {
        if (filter_data_array.length == i){
            break;
        }
        for (let j = 0; j <filter_data_array[i].length ; j++) {
            if (filter_data_array[i][0] != ""){
                title = filter_data_array[i][0];
            }
            else{
                title = "not available";
            }
            if(filter_data_array[i][1] !=  ""){
                link  = filter_data_array[i][1];
            }else {
                link = "not available";
            }
            if(name_of_sheet == "Resources"){
                if(filter_data_array[i][2] != ""){
                    pdf_permalink = filter_data_array[i][2];
                }
                else{
                    pdf_permalink = "not available";
                }
                if(filter_data_array[i][3] != ""){
                    area_of_work = filter_data_array[i][3];
                }else {
                    area_of_work = "not available"
                }
                if(filter_data_array[i][4] != ""){
                    resourcetype = filter_data_array[i][4];
                }else{
                    resourcetype = "not available"
                }
                if(filter_data_array[i][5] != ""){
                    topic_area = filter_data_array[i][5];
                }else{
                    topic_area = "not available";
                }
                if(filter_data_array[i][6] != "" ){
                    who = filter_data_array[i][6];
                }else{
                    who = "not available";
                }
            }
            if(name_of_sheet == "Funding"){
                if(filter_data_array[i][2] != ""){
                    area_of_work = filter_data_array[i][2];
                }else {
                    area_of_work = "not available"
                }
                if(filter_data_array[i][3] != ""){
                    topic_area = filter_data_array[i][3];
                }else{
                    topic_area = "not available";
                }
                if(filter_data_array[i][5] != ""){
                    type = filter_data_array[i][5];
                }else{
                    type = "not available";
                }
                if(filter_data_array[i][6] != "" ){
                    eligibility = filter_data_array[i][6];
                }else{
                    eligibility = "not available";
                }
                if(filter_data_array[i][7] != "" ){
                    eligibility_two = filter_data_array[i][7];
                }else{
                    eligibility_two = "not available";
                }
                if(filter_data_array[i][8] != "" ){
                    eligibility_three = filter_data_array[i][8];
                }else{
                    eligibility_three = "not available";
                }
                if(filter_data_array[i][9] != "" ){
                    eligibility_four = filter_data_array[i][9];
                }else{
                    eligibility_four = "not available";
                }
            }

        }

        let container_data = document.getElementById('container_data');
        if(name_of_sheet == "Resources"){
            container_data.innerHTML += `
                                       <div class="col-md-4 col-sm-12 col-lg-4 mb-2">
                                           <div class="card" >
                                             <div class="card-body">
                                                  <a href="${link}" target="_blank" class="links" style="color: #1659a2;" tabindex="${i+1}"><h5 class="card-title">${title}</h5></a>
                                                  <div class="p_items">
                                                    <p tabindex="${i+1}"><span style="font-weight: 500">Area of  work</span>: ${area_of_work === undefined ? ' - ' : area_of_work}</p>
                                                    <p tabindex="${i+1}"><span style="font-weight: 500">Resource Type</span>: ${resourcetype === undefined ? ' - ' : resourcetype}</p>
                                                    <p tabindex="${i+1}"><span style="font-weight: 500">Topic Area</span>: ${topic_area   === undefined ? ' - ' : topic_area}</p>
                                                  </div>
                                                </div>
                                           </div>
                                       </div>
                                `
        }
        if(name_of_sheet == "Funding"){
            set_topic_area_columns_to_data(filter_data_array[i].slice(3,10));
            set_type_columns_to_data(filter_data_array[i].slice(11,19));
            set_eligibilty_columns_to_data(filter_data_array[i].slice(19,33));
            container_data.innerHTML += `
               <div class="col-md-4 col-sm-12 col-lg-4 mb-2">
                   <div class="card" >
                     <div class="card-body">
                          <a href="${link}" target="_blank" class="links" style="color: #1659a2;" tabindex="${i+1}"><h5 class="card-title">${title}</h5></a>
                          <div class="p_items" style="white-space: normal;">
                            <p tabindex="${i+1}"><span style="font-weight: 500">Area of  work</span>: ${area_of_work === undefined ? ' - ' : area_of_work}</p>
                            <p tabindex="${i+1}"><span style="font-weight: 500">Topic Area</span>: ${topic_area === undefined ? ' - ' : topic_area == '' ? ' - ' : topic_area}</p>
                            <p tabindex="${i+1}"><span style="font-weight: 500">Type</span>: ${type === undefined ? ' - ' : type == '' ? ' - ' : type}</p>
                            <p tabindex="${i+1}"><span style="font-weight: 500">Eligibility</span>:${eligibility === undefined ? ' - ' :eligibility == '' ? ' - ' : eligibility}</p>
                          </div>
                     </div>
                   </div>
               </div>
                                `
        }

    }
}

function active_page_link(iteration=null,filter_value = null){
    const pagination_links =  document.querySelectorAll('.page-item');
    pagination_links.forEach(link => link.classList.remove('active'))
    document.getElementById('page_nav_link_'+iteration).classList.add('active');
    let start_index = (iteration - 1) * 20; // 20 items per page
    let end_index = start_index + 20;

    if (iteration === 1) {
        document.getElementById('previous_page').classList.add('disabled');
        start_index = 0;
        end_index = 21; // Start from 1 and end at 20 for the first page
    }else if(iteration >  1){
        page_iteration = iteration;
        document.getElementById('previous_page').classList.remove('disabled');
    }
    if (iteration == pagination_length){
        document.getElementById('next_page').classList.add('disabled');
    }else if(iteration < pagination_length){
        document.getElementById('next_page').classList.remove('disabled');
    }


    // Ensure the end_index doesn't go beyond the array length
    if (end_index > sheet_data.length) {
        end_index = sheet_data.length;
    }
    document.getElementById('container_data').innerHTML = '';
    for (let i = start_index; i <end_index; i++) {
        for (let j = 0; j <sheet_data[i].length ; j++) {
            if (sheet_data[i][0] != ""){
                title = sheet_data[i][0];
            }
            else{
                title = "not available";
            }
            if(sheet_data[i][1] !=  ""){
                link  = sheet_data[i][1];
            }else {
                link = "not available";
            }
            if(name_of_sheet == "Resources"){
                if(sheet_data[i][2] != ""){
                    pdf_permalink = result[i][2];
                }
                else{
                    pdf_permalink = "not available";
                }
                if(sheet_data[i][3] != ""){
                    area_of_work = sheet_data[i][3];
                }else {
                    area_of_work = "not available"
                }
                if(sheet_data[i][4] != ""){
                    resourcetype = sheet_data[i][4];
                }else{
                    resourcetype = "not available"
                }
                if(sheet_data[i][5] != ""){
                    topic_area = sheet_data[i][5];
                }else{
                    topic_area = "not available";
                }
                if(sheet_data[i][6] != "" ){
                    who = sheet_data[i][6];
                }else{
                    who = "not available";
                }
            }
            if(name_of_sheet == "Funding"){
                if(sheet_data[i][2] != ""){
                    area_of_work = sheet_data[i][2];
                }else {
                    area_of_work = "not available"
                }
                if(sheet_data[i][3] != ""){
                    topic_area = sheet_data[i][3];
                }else{
                    topic_area = "not available";
                }
                if(sheet_data[i][5] != ""){
                    type = sheet_data[i][5];
                }else{
                    type = "not available";
                }
                if(sheet_data[i][6] != "" ){
                    eligibility = sheet_data[i][6];
                }else{
                    eligibility = "not available";
                }
                if(sheet_data[i][7] != "" ){
                    eligibility_two = sheet_data[i][7];
                }else{
                    eligibility_two = "not available";
                }
                if(sheet_data[i][8] != "" ){
                    eligibility_three = sheet_data[i][8];
                }else{
                    eligibility_three = "not available";
                }
                if(sheet_data[i][9] != "" ){
                    eligibility_four = sheet_data[i][9];
                }else{
                    eligibility_four = "not available";
                }
            }

        }

        let container_data = document.getElementById('container_data');
        if(name_of_sheet == "Resources"){
            container_data.innerHTML += `
               <div class="col-md-4 col-sm-12 col-lg-4 mb-2">
                   <div class="card" >
                     <div class="card-body">
                          <a href="${link}" target="_blank" class="links" style="color: #1659a2;" tabindex="${i+1}"><h5 class="card-title">${title}</h5></a>
                          <div class="p_items">
                            <p tabindex="${i+1}"><span style="font-weight: 500">Area of  work</span>: ${area_of_work === undefined ? ' - ' : area_of_work}</p>
                            <p tabindex="${i+1}"><span style="font-weight: 500">Resource Type</span>: ${resourcetype === undefined ? ' - ' : resourcetype}</p>
                            <p tabindex="${i+1}"><span style="font-weight: 500">Topic Area</span>: ${topic_area   === undefined ? ' - ' : topic_area}</p>
                          </div>
                        </div>
                   </div>
               </div>
               `
        }
        if(name_of_sheet == "Funding"){
            set_topic_area_columns_to_data(sheet_data[i].slice(3,10));
            set_type_columns_to_data(sheet_data[i].slice(11,19));
            set_eligibilty_columns_to_data(sheet_data[i].slice(19,33));
            container_data.innerHTML += `
               <div class="col-md-4 col-sm-12 col-lg-4 mb-2">
                   <div class="card" >
                         <div class="card-body">
                              <a href="${link}" target="_blank" class="links" style="color: #1659a2;" tabindex="${i+1}"><h5 class="card-title">${title}</h5></a>
                              <div class="p_items">
                                <p tabindex="${i+1}"><span style="font-weight: 500">Area of  work</span>: ${area_of_work === undefined ? ' - ' : area_of_work}</p>
                                <p tabindex="${i+1}"><span style="font-weight: 500">Topic Area</span>: ${topic_area === undefined ? ' - ' : topic_area == '' ? ' - ' : topic_area}</p>
                                <p tabindex="${i+1}"><span style="font-weight: 500">Type</span>: ${type === undefined ? ' - ' : type == '' ? ' - ' : type}</p>
                                <p tabindex="${i+1}"><span style="font-weight: 500">Eligibility</span>:${eligibility === undefined ? ' - ' : eligibility == '' ? ' - ' : eligibility}
                                </p>
                              </div>
                         </div>
                   </div>
               </div>
               `
        }

    }
}
function areAllCheckboxesUnchecked(class_name = filter_item) {
    const checkboxes = document.querySelectorAll('.filter_items'); // Select all checkboxes with class 'filter_item'
    // Use the `every` method to check if all checkboxes are unchecked
    const allUnchecked = Array.from(checkboxes).every(checkbox => !checkbox.checked);
    return allUnchecked;
}

function customSort(a, b) {
    const strA = a[0].toLowerCase(); // Assuming you want to sort based on the first element of each inner array
    const strB = b[0].toLowerCase();

    if (strA < strB) {
        return -1;
    }
    if (strA > strB) {
        return 1;
    }
    return 0;
}
function filter_item(iteration){
    let filter_data = [];
    all_filter_data = sheet_data;
    let all_checked_flag = true;
    let checked_value = document.getElementById('filter_item_'+iteration);
    let parent_filter = checked_value.closest("ul").id;
    const area_of_work_checkboxes = document.querySelectorAll('.area_of_work_filter_item');
    const resource_type_checkboxes = document.querySelectorAll('.resource_type_filter_item');
    const topic_checkboxes = document.querySelectorAll('.topic_area_filter_item');
    if(parent_filter == "filter_1"){
        if(name_of_sheet == "Resources"|| name_of_sheet == "Funding"){
            if (checked_value.checked){
                area_of_work_checked_values.push(checked_value.value);
            }else {
                if (area_of_work_checked_values.length > 0) {
                    test_flag = false;
                    var item_index_value = area_of_work_checked_values.indexOf(checked_value.value);
                    if (item_index_value !== -1) {
                        area_of_work_checked_values.splice(item_index_value, 1);
                    }
                }
            }
        }
    }else if(parent_filter == "filter_2"){
        if(name_of_sheet == "Resources"){
            if (checked_value.checked){
                resource_type_checked_values.push(checked_value.value);
            }else {
                if (resource_type_checked_values.length > 0) {
                    test_flag = false;
                    var item_index_value = resource_type_checked_values.indexOf(checked_value.value);
                    if (item_index_value !== -1) {
                        resource_type_checked_values.splice(item_index_value, 1);
                    }
                }
            }
        }
        if(name_of_sheet == "Funding"){
            if (checked_value.checked){
                topic_area_checked_values.push(checked_value.value);
            }else {
                if (topic_area_checked_values.length > 0) {
                    test_flag = false;
                    var item_index_value = topic_area_checked_values.indexOf(checked_value.value);
                    if (item_index_value !== -1) {
                        topic_area_checked_values.splice(item_index_value, 1);
                    }
                }
            }
        }

    }else if(parent_filter == "filter_3"){
        if(name_of_sheet == "Resources"){
            if (checked_value.checked){
                topic_area_checked_values.push(checked_value.value);
            }else {
                if (topic_area_checked_values.length > 0) {
                    test_flag = false;
                    var item_index_value = topic_area_checked_values.indexOf(checked_value.value);
                    if (item_index_value !== -1) {
                        topic_area_checked_values.splice(item_index_value, 1);
                    }
                }
            }
        }
        if(name_of_sheet == "Funding"){
            if (checked_value.checked){
                type_checked_values.push(checked_value.value);
            }else {
                if (type_checked_values.length > 0) {
                    test_flag = false;
                    var item_index_value = type_checked_values.indexOf(checked_value.value);
                    if (item_index_value !== -1) {
                        type_checked_values.splice(item_index_value, 1);
                    }
                }
            }
        }
    }else if (parent_filter == "filter_4"){
        if(name_of_sheet ==  "Funding"){
            if (checked_value.checked){
                eligibility_checked_values.push(checked_value.value);
            }else {
                if (eligibility_checked_values.length > 0) {
                    test_flag = false;
                    var item_index_value = eligibility_checked_values.indexOf(checked_value.value);
                    if (item_index_value !== -1) {
                        eligibility_checked_values.splice(item_index_value, 1);
                    }
                }
            }
        }
    }
    if(area_of_work_checked_values.length != 0){
        if(name_of_sheet == "Resources"){
            for (let i = 0; i <all_filter_data.length ; i++) {
                if(area_of_work_checked_values.includes(all_filter_data[i][3])){
                    filter_data.push(all_filter_data[i]);
                }
            }
        }
        if(name_of_sheet == "Funding"){
            for (let i = 0; i <all_filter_data.length ; i++) {
                if(area_of_work_checked_values.includes(all_filter_data[i][2])){
                    filter_data.push(all_filter_data[i]);
                }
            }
        }

        all_filter_data = filter_data;

    }
    if(resource_type_checked_values.length != 0){
        let t2 = [];
        for (let i = 0; i <all_filter_data.length ; i++) {
            if(resource_type_checked_values.includes(all_filter_data[i][4])){
                t2.push(all_filter_data[i]);
            }
        }
        all_filter_data = t2;

    }
    if(topic_area_checked_values.length != 0){
        let t3 = [];
        if (name_of_sheet == "Resources"){
            for (let i = 0; i <all_filter_data.length ; i++) {
                if(topic_area_checked_values.includes(all_filter_data[i][5])){
                    t3.push(all_filter_data[i]);
                }
            }
        }
        if(name_of_sheet == "Funding"){
            for (let i = 0; i <all_filter_data.length ; i++) {
                if(topic_area_checked_values.includes(all_filter_data[i][3])
                    || topic_area_checked_values.includes(all_filter_data[i][4])
                    || topic_area_checked_values.includes(all_filter_data[i][5])
                    || topic_area_checked_values.includes(all_filter_data[i][6])
                    || topic_area_checked_values.includes(all_filter_data[i][7])
                    || topic_area_checked_values.includes(all_filter_data[i][8])
                    || topic_area_checked_values.includes(all_filter_data[i][9])){
                    t3.push(all_filter_data[i]);
                }
            }
        }

        all_filter_data = t3;
    }
    if(type_checked_values.length != 0){
        let t4 = [];
        for (let i = 0; i <all_filter_data.length ; i++) {
            if(type_checked_values.includes(all_filter_data[i][11])
                || type_checked_values.includes(all_filter_data[i][12])
                || type_checked_values.includes(all_filter_data[i][13])
                || type_checked_values.includes(all_filter_data[i][14])
                || type_checked_values.includes(all_filter_data[i][15])
                || type_checked_values.includes(all_filter_data[i][16])
                || type_checked_values.includes(all_filter_data[i][17])
                || type_checked_values.includes(all_filter_data[i][18])){
                t4.push(all_filter_data[i]);
            }
        }
        all_filter_data = t4;
    }
    if(eligibility_checked_values.length != 0){
        let t5 = [];
        for (let i = 0; i <all_filter_data.length ; i++) {

            if(eligibility_checked_values.includes(all_filter_data[i][19])
                || eligibility_checked_values.includes(all_filter_data[i][20])
                || eligibility_checked_values.includes(all_filter_data[i][21])
                || eligibility_checked_values.includes(all_filter_data[i][22])
                || eligibility_checked_values.includes(all_filter_data[i][23])
                || eligibility_checked_values.includes(all_filter_data[i][24])
                || eligibility_checked_values.includes(all_filter_data[i][25])
                || eligibility_checked_values.includes(all_filter_data[i][26])
                || eligibility_checked_values.includes(all_filter_data[i][27])
                || eligibility_checked_values.includes(all_filter_data[i][28])
                || eligibility_checked_values.includes(all_filter_data[i][29])
                || eligibility_checked_values.includes(all_filter_data[i][30])
                || eligibility_checked_values.includes(all_filter_data[i][31])
                || eligibility_checked_values.includes(all_filter_data[i][32])
                || eligibility_checked_values.includes(all_filter_data[i][33])){
                t5.push(all_filter_data[i]);
            }
        }
        all_filter_data = t5;
    }

    all_filter_data.sort(customSort);
    generate_pagination(all_filter_data.length,true);
    set_sheet_data(all_filter_data,name_of_sheet);


}
// all_filter_data = [];
function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
function search_filter(){

    search_text = document.getElementById('search_text').value;
    if (search_text.trim() === ''){
        sheet_data_from_api();
    }
    const regex = new RegExp(search_text, 'i'); // 'i' flag for case-insensitive search
    var search_results = sheet_data.filter(subarray => subarray.some(value => regex.test(value)));
    sheet_data_for_search = search_results;
    all_filter_data = search_results;
    filter_data_array = search_results;
    if(search_results.length > 0){
        search_results.sort(customSort);
        generate_pagination(search_results.length,true);
        set_sheet_data(search_results,name_of_sheet);
    }else{
        let container_data = document.getElementById('container_data');
        container_data.innerHTML = `
                    <div class="row text-center" style="margin-left: 5px;">
                        <div class="col-md-12">
                            <h3>Nothing Found</h3>
                        </div>
                    </div>
                `;
    }

}

const showLoader = ()=>{
  document.getElementById("loader").classList.remove("hidden");
  document.getElementById("video-container").classList.add("hidden")
}
  const hideLoader = ()=>{
    document.getElementById("loader").classList.add("hidden");
    document.getElementById("video-container").classList.remove("hidden")
  
  }
function loadCategories() {
  
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories));
}

loadCategories();

function displayCategories(categories) {
  
  const categoriesContainer = document.getElementById("category-container");
  for (let cat of categories) {
    const categoryBtn = document.createElement("button");
    categoryBtn.innerHTML = `
        <button id="btn-${cat.category_id}" onclick="loadCategoryVideo(${cat.category_id})" class = "btn btn-sm hover:bg-[#FF1F3D] hover:text-white">${cat.category}</button>`;
    categoriesContainer.appendChild(categoryBtn);
  }
}


function loadVideos(searchText = ""){
    showLoader()
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`).then((res)=> res.json()).then((data)=>{
        displayVideos(data.videos);
        removeActiveClass();
        const btnAll = document.getElementById("btn-all");
        btnAll.classList.add("active");
    })
}
loadVideos()

const displayVideos = (videos)=>{
    const videoContainer = document.getElementById("video-container");
    videoContainer.innerHTML="";
    if(videos.length == 0){
        videoContainer.innerHTML=`
        <div class="col-span-full flex flex-col justify-center items-center text-center mt-10 space-y-6">
        <img class="w-44" src="./assets/Icon.png" alt="">
        <h2 class="text-3xl font-bold">Oops!! Sorry, There is no content here</h2>
      </div>`;
      hideLoader()
      return;
    }
    videos.forEach(video => {
        console.log(video)
        const videoCard = document.createElement("div");
        videoCard.innerHTML=`
        <div class="card">
        <figure class="relative">
          <img class="w-full h-[150px] object-cover"
            src="${video.thumbnail}" />
            <span class="absolute bottom-2 right-2 text-white bg-[#171717] p-2 text-sm rounded-sm">3hrs 56 min ago</span>
        </figure>
        <div class="flex gap-3 px-0 py-5 items-center">
          <div class="profile">
            <div class="avatar">
              <div class="ring-primary w-8 rounded-full ">
                <img src="${video.authors[0].profile_picture}" />
              </div>
            </div>
          </div>
          <div class="intro space-y-1">
            <h2 class=" text-xl">${video.title}</h2>
            <p class="text-sm text-gray-400 flex items-center gap-2">${video.authors[0].profile_name}
            ${video.authors[0].verified == true ? `<img class="w-4 h-4" src="https://img.icons8.com/?size=48&id=98A4yZTt9abw&format=png" alt="">` : ``}
            </p>
            <p class="text-sm text-gray-400">${video.others.views}</p>
          </div>
          
      </div>
      <button onclick="loadVideoDetails('${video.video_id}')" class="btn btn-block">block</button>`;

        videoContainer.append(videoCard)
    });
  hideLoader()
}

const loadCategoryVideo = (id)=>{
  showLoader()
    const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`
    fetch(url).then(res=>res.json()).then(data=>{
        removeActiveClass()
        const clickedBtn = document.getElementById(`btn-${id}`);
        clickedBtn.classList.add("active")
        console.log(clickedBtn)

        displayVideos(data.category)
    })
}

function removeActiveClass(){
    const activeBtn  = document.getElementsByClassName("active");
    for(let btn of activeBtn){
        btn.classList.remove("active");
    }
}

const loadVideoDetails = (videoId)=>{
  const url =`https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`
  fetch(url)
  .then(res=>res.json())
  .then(data=>displayVideoDetails(data.video))
}

const displayVideoDetails = (video) => {
  document.getElementById("video_details").showModal();
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML=`<div class="card bg-base-100 image-full shadow-sm">
  <figure>
    <img
      src="${video.thumbnail}"
      alt="Shoes" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">${video.title}</h2>
    <p>${video.description}</p>
    <div class="card-actions justify-end">
    </div>
  </div>
</div>
  `
}

document.getElementById("search-input").addEventListener("keyup",(e)=>{
  const input = e.target.value;
  loadVideos(input)
})


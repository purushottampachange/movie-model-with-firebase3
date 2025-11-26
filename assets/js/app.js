
const cl = console.log;

const nfxBtn = document.getElementById("nfxBtn");

const backDrop = document.getElementById("backDrop");

const movieModel = document.getElementById("movieModel");

const closeBtn = document.querySelectorAll(".closeBtn");

const movieForm = document.getElementById("movieForm");
const movieName = document.getElementById("movieName");
const movieImg = document.getElementById("movieImg");
const movieDes = document.getElementById("movieDes");
const movieRating = document.getElementById("movieRating");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const spinner = document.getElementById("spinner");
const movieContainer = document.getElementById("movieContainer");

const onHideShow = () => {
    backDrop.classList.toggle('active');
    movieModel.classList.toggle('active');
}

const BaseURL = "https://post-task-xhr-default-rtdb.firebaseio.com/";

const PostURL = "https://post-task-xhr-default-rtdb.firebaseio.com/movies.json";

const SnackBar = (icon, msg) => {

    Swal.fire({

        title: msg,
        icon: icon,
        timer: 1500
    })
}

const ConvertArr = (obj) => {

    let res = [];

    for (const key in obj) {

        res.unshift({ ...obj[key], id: key });
    }
    return res;
}

const RatingClass = (rating) => {

    if (rating > 9) {

        return "badge-success";
    }
    else if (rating > 6 && rating <= 9) {

        return "badge-warning";
    }
    else {

        return "badge-danger"
    }
}

const MakeAPICall = async (apiURL, method, body) => {

    spinner.classList.remove("d-none");

    body = body ? JSON.stringify(body) : null;

    let configObj = {

        method: method,
        body: body,
        headers: {

            "auth": "token",
            "content-type": "application/json"
        }
    }

    try {

        let res = await fetch(apiURL, configObj);

        if (!res.ok) {

            throw new Error(res.statusText);
        }

        return res.json();

    }
    catch (err) {

        SnackBar("error", err);

    }
    finally {

        spinner.classList.add("d-none");
    }

}

const Templating = (arr) => {

    let res = arr.map(m => {

        return `   
           
             <div class="col-md-3 mb-4" id="${m.id}">
                <div class="card movieCard text-white">
                    <div class="card-header p-0">
                        <div class="row">
                            <div class="col-10">
                                <h5>${m.title}</h5>
                            </div>
                            <div class="col-2">
                                <span class="badge ${RatingClass(m.rating)}">${m.rating}</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <figure>
                            <img src="${m.imgPath}"
                                alt="${m.title}">
                            <figcaption>
                                <p>${m.content}</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between p-0">
                        <button class="btn btn-sm btn-success" onclick = "onEdit(this)">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick = "onRemove(this)">Remove</button>
                    </div>
                </div>
            </div>

        `;
    }).join("");

    movieContainer.innerHTML = res;
}

const CreateCard = (m, id) => {

    let card = document.createElement("div");

    card.id = id;

    card.className = "col-md-3 mb-4";

    card.innerHTML = `
      
              <div class="card movieCard text-white">
                    <div class="card-header p-0">
                        <div class="row">
                            <div class="col-10">
                                <h5>${m.title}</h5>
                            </div>
                            <div class="col-2">
                                <span class="badge ${RatingClass(m.rating)}">${m.rating}</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <figure>
                            <img src="${m.imgPath}"
                                alt="${m.title}">
                            <figcaption>
                                <p>${m.content}</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer d-flex justify-content-between p-0">
                        <button class="btn btn-sm btn-success" onclick = "onEdit(this)">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick = "onRemove(this)">Remove</button>
                    </div>
                </div> 
    
    `;

    movieContainer.prepend(card);
}

const FetchData = async () => {

    let res = await MakeAPICall(PostURL, "GET", null);

    Templating(ConvertArr(res));
}

FetchData();

const onSubmit = async (eve) => {

    eve.preventDefault();

    let movieObj = {

        title: movieName.value,
        content: movieDes.value,
        imgPath: movieImg.value,
        rating: movieRating.value
    }

    let res = await MakeAPICall(PostURL, "POST", movieObj);
   
    CreateCard(movieObj,res.name);
    
    movieForm.reset();
}

closeBtn.forEach(b => b.addEventListener("click", onHideShow));
nfxBtn.addEventListener("click", onHideShow);
movieForm.addEventListener("submit", onSubmit);


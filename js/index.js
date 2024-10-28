document.addEventListener("DOMContentLoaded", () => {
    const URL = "https://japceibal.github.io/japflix_api/movies-data.json";
    let listaPelis = [];
    let searchQuery = "";

    fetch(URL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return response.json();
        })
        .then(data => {
            listaPelis = data;
        })
        .catch(error => console.error("Error en la petición:", error));

        function mostrarPelis() {
            const lista = document.getElementById("lista");
            searchQuery = document.getElementById("inputBuscar").value;

            if (searchQuery === "") {
                lista.innerHTML = ""; // Limpiar el contenedor de películas
                return; // Salir de la función
            }

            lista.innerHTML = "" //Limpiar la lista para una nueva búsqueda
                    
            // Filtrar películas que coincidan con la búsqueda
            const peliculasFiltradas = listaPelis.filter(pelicula => 
                (pelicula.title + pelicula.genres.map(genre => genre.name).join(" ") + pelicula.overview + pelicula.tagline)
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            );
        
            if (peliculasFiltradas.length > 0) {
                peliculasFiltradas.forEach(pelicula => {
                    let estrellas = generarEstrellas(pelicula.vote_average);
                    let htmlContentToAppend = `
                        <li class="list-group-item bg-dark text-white mb-2" 
                            data-title="${pelicula.title}" 
                            data-overview="${pelicula.overview}" 
                            data-genres='${JSON.stringify(pelicula.genres)}'
                            data-year="${pelicula.release_date.split('-')[0]}" 
                            data-duration="${pelicula.runtime}" 
                            data-budget="${pelicula.budget}" 
                            data-revenue="${pelicula.revenue}">
                            <div class="card-blur">
                                <h5 class="card-title">${pelicula.title}</h5>
                                <p class="card-text">${pelicula.tagline}</p>
                                <p class="product-rating">Rating: ${estrellas}</p>
                            </div>
                        </li>`;
                    lista.innerHTML += htmlContentToAppend;
                });
        
                // Agregar evento de click a cada película
                const movieItems = document.querySelectorAll("#lista .list-group-item");
                movieItems.forEach(item => {
                    item.addEventListener("click", () => {
                        const titulo = item.getAttribute("data-title");
                        const overview = item.getAttribute("data-overview");
                        const genres = JSON.parse(item.getAttribute("data-genres"));
                        const year = item.getAttribute("data-year");
                        const duration = item.getAttribute("data-duration");
                        const budget = item.getAttribute("data-budget") ? `$${Number(item.getAttribute("data-budget")).toLocaleString()}` : 'No disponible';
                        const revenue = item.getAttribute("data-revenue") ? `$${Number(item.getAttribute("data-revenue")).toLocaleString()}` : 'No disponible';
        
                        const genresListHTML = genres.map(genre => `
                            <li class="badge bg-primary me-1">${genre.name}</li>
                        `).join('');
        
                        document.getElementById("movieGenres").innerHTML = `<ul>${genresListHTML}</ul>`;
                        document.getElementById("offcanvasMovieLabel").innerText = titulo;
                        document.getElementById("movieOverview").innerText = overview;
                        document.getElementById("movieYear").innerText = year;
                        document.getElementById("movieDuration").innerText = duration;
                        document.getElementById("movieBudget").innerText = budget;
                        document.getElementById("movieRevenue").innerText = revenue;
        
                        const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasMovie'));
                        offcanvas.show();
                    });
                });
            } else {
                alert("No se encontraron resultados");
            }        
    }

    const botonBuscar = document.getElementById("btnBuscar");
    botonBuscar.addEventListener('click', () => {
        searchQuery = document.getElementById("inputBuscar").value;
        mostrarPelis();
    });

    function generarEstrellas(voteAverage) {
        const starsOutOfFive = Math.round(voteAverage / 2); // Como la escala es de 10, la reducimos a 5
        let stars = '';
      
        for (let i = 0; i < 5; i++) {
            if (i < starsOutOfFive) {
                stars += '<span class="fa fa-star checked"></span>'; 
            } else {
                stars += '<span class="fa fa-star"></span>';
            }
        }
        return stars;
    }
});
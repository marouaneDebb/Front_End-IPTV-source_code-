import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Movie } from 'src/models/movie';
import { movieservice } from './../../service/movie.service';
import { MovieDetail } from 'src/models/movieDetails';
import { Comment } from 'src/models/comment';
import { FavoriteMovie } from 'src/models/favorite';
import { FavoriteService } from 'src/service/favorite.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FavoriteMovieBack } from 'src/models/favoriteBack';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css'],
})
export class MovieDetailsComponent implements OnInit {
  selectedMovie!: MovieDetail;
  constructor(
    private route: ActivatedRoute,
    private movieservice: movieservice, private favoriteService: FavoriteService
  ) {}
  commentText: String = '';
  comments: Comment[] = [];
  favoritemovie!:FavoriteMovie;
  newComment!:Comment;
  FavoriteBack!:FavoriteMovieBack;
  favorites: FavoriteMovieBack[] = [];
  username!:String;

  isFavorite!: boolean;
  movieId!:number


  ngOnInit() {
    this.route.params.subscribe((params) => {
      const movieId = params['id'];
      this.username = params['username']
      this.movieservice.getDetailMv(movieId).subscribe((data) => {
        this.selectedMovie = data;
        this.movieId=movieId;
      });
      this.getCommentFromBackend(movieId);
      this.getFavoriteFromBackend(movieId)
      

      console.log(
        'from detail movie comp' + this.selectedMovie?.original_title
      );
      // console.log('from detail movie comp movieid ' + movieId);
      // this.favoriteService.getFavoriteMovie().subscribe((favoriteMovie) => {
      //   console.log("from onItfunc "+favoriteMovie.movieID+" and it's "+favoriteMovie.isFavorite)
      //   console.log('###########################')
      //   this.isFavorite = favoriteMovie.movieID == movieId && favoriteMovie.isFavorite;

      // }
      // );
    });
    
  }
  
  addComment() {
    const localDate: String = new Date().toLocaleString();
    if(this.commentText!=""){this.newComment = {
      comment_Text: this.commentText,
      comment_Date: localDate,
      movieID:this.movieId,
      username:this.username
    };
    this.addCommetToBackend(this.newComment)
    this.comments.push(this.newComment);
    this.commentText = '';
    console.log(this.comments);}
    
  }
  addCommetToBackend(comment:Comment){
    this.movieservice.addComments(comment).subscribe(
      (response: Comment) => {
        console.log("adding comments from frontend")
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }



  
  getCommentFromBackend(movieId:number){
    this.movieservice.getComment(movieId).subscribe(
      (response: Comment[]) => {
        this.comments=response;
        console.log("getting comments from backend")
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }

  getAllCommentFromBackend(){
    this.movieservice.getAllComment().subscribe(
      (response: Comment[]) => {
        this.comments=response;
        console.log("getting comments from backend")
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }


  addFavoriteToBackend(favorite:FavoriteMovieBack){
    this.favoriteService.addFavorite(favorite).subscribe(
      (response: FavoriteMovieBack) => {
        console.log("adding favorite from frontend")
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }
  getFavoriteFromBackend(movieID: number) {
    console.log("in the getFavoriteFromBackend function");
    console.log("the user name is " + this.username);
  
    this.favoriteService.getFavoriteByMovieID(movieID, this.username).subscribe(
      (response: FavoriteMovieBack) => {
        console.log("Response from getFavoriteByMovieID:", response);
      
        // Add other logging for debugging if needed
      
        if (response && response.movieID) {
          this.isFavorite = true;
          console.log("isFavorite is set to true");
        } else {
          this.isFavorite = false;
          console.log("isFavorite is set to false");
        }
      
        console.log("Value of isFavorite after setting:", this.isFavorite);
      
        console.log("getting favorite from backend ana");
      },
      
      (error: HttpErrorResponse) => {
        console.error("Error in getFavoriteByMovieID:", error);
        alert(error.message);
      }
    );
    console.log("the value of FavoriteBack is " + this.FavoriteBack);
  }
  

  getAllFavoritesFromBackend(){
    this.favoriteService.getAllFavorites(this.username).subscribe(
      (response: FavoriteMovieBack[]) => {
        this.favorites=response;
        console.log("getting favorites from backend")
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    )
  }

deleteFavoriteFromBackend(movieID: number){
    this.favoriteService.deleteFavoriteByMovieID(movieID,this.username).subscribe(
      (response: FavoriteMovieBack) => {
        this.isFavorite=false

        console.log("deleting favorite from backend")
      },
      (error: HttpErrorResponse) => {
        alert(error.message)
      }
    );

    
  }

  addFavorie() {
    this.isFavorite = !this.isFavorite;
  
    if (this.isFavorite) {
      const newFavorite: FavoriteMovieBack = {
        movieID: this.movieId,
        username:this.username
      };
      this.addFavoriteToBackend(newFavorite);
  
      // Make sure to refresh the favorites array after adding a new favorite
      this.getFavoriteFromBackend(this.movieId);
    } else {
      // Check if favorites array is defined
      if (this.favorites) {
        // Find the favorite with the specified movieID
        console.log("entring if for favorites")

          console.log("entring if for favoriteToRemove")
          this.deleteFavoriteFromBackend(this.movieId);
    }
  }
  
}
  
  
}

import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Title';
  names$: Observable<string[]> = of(['John', 'Bob', 'Nick']);
  searchTerm: string;
  results: Observable<string[]>;

  constructor(private http: HttpClient) {
  }

  newSearch(searchTerm: string) {
    this.results = this.http.get(`https://api.github.com/search/repositories?q=${searchTerm}&sort=stars&order=desc`)
      .pipe(
        map(results => results.items)
      );
  }

  ngOnInit(): void {
  }
}

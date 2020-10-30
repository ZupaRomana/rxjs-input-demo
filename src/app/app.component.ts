import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, tap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Title';
  names$: Observable<string[]> = of(['John', 'Bob', 'Nick']);
  searchTerm: string;
  results: Observable<string[]>;
  searchTerm$: Subject<string> = new Subject<string>();
  stop$: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {
  }

  newSearch(searchTerm: string): void {
    this.searchTerm$.next(searchTerm);
  }

  ngOnInit(): void {
    this.results = this.searchTerm$.asObservable()
      .pipe(
        takeUntil(this.stop$),
        debounceTime(500),
        filter((term: string) => !!term),
        distinctUntilChanged(),
        switchMap((term: string) => this.http
          .get(`https://api.github.com/search/repositories?q=${term}&sort=stars&order=desc`)
        ),
        map(results => results.items)
      );
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }
}

import { async, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { CoursesModule } from '../courses.module';
import { DebugElement } from '@angular/core';

import { HomeComponent } from './home.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from '../services/courses.service';
import { HttpClient } from '@angular/common/http';
import { COURSES } from '../../../../server/db-data';
import { setupCourses } from '../common/setup-test-data';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { click } from '../common/test-utils';




describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let el: DebugElement;
  let coursesService: any

  const begginnerCourse = setupCourses()
    .filter(course => course.category === 'BEGINNER');

  const advancedCourse = setupCourses()
    .filter(course => course.category === 'ADVANCED')

  beforeEach(waitForAsync(() => {

    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses'])

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CoursesService, useValue: coursesServiceSpy }
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService)
      })

  }));

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });


  it("should display only beginner courses", () => {
    //specifyingg here the setup phase of the test 
    coursesService.findAllCourses.and.returnValue(of(begginnerCourse));

    //The execution phase
    fixture.detectChanges();

    // the test assertions sequentially
    const tabs = el.queryAll(By.css('.mdc-tab'))

    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
  });


  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourse));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mdc-tab'));

    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');
  });


  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mdc-tab'));
    expect(tabs.length).toBe(2, 'Expected to find 2 tabs')
  });


  it("should display advanced courses when tab clicked", fakeAsync(() => {
    //set up lis of courses
    coursesService.findAllCourses.and.returnValue(of(advancedCourse));

    //will apply to our dom changes
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mdc-tab'));

    //Selected advanced button onClick
    el.nativeElement.click(tabs[1]);

    //will apply to our dom changes
    fixture.detectChanges();

    //executed our task from the queue
    flush()

    //array of all the cards with titles
    const cardTitle = el.queryAll(By.css(".mat-mdc-card-title"));

    //Check is it empty array with all titles
    expect(cardTitle.length).toBeGreaterThan(0, "Could not find card titles");

    expect(cardTitle[0].nativeElement.textContent).toContain("Angular Security Course - Web Security Fundamentals", "Could not the same name of the course");

  }));

  it("should display advanced courses when tab clicked - waitForasync", waitForAsync(() => {
    //set up lis of courses
    coursesService.findAllCourses.and.returnValue(of(advancedCourse));

    //will apply to our dom changes
    fixture.detectChanges();
    const tabs = el.queryAll(By.css('.mdc-tab'));

    //Selected advanced button onClick
    el.nativeElement.click(tabs[1]);

    //will apply to our dom changes
    fixture.detectChanges();

    //whenStable will return a promise
    fixture.whenStable().then(() => {

      console.log('Called whenStable()');

      //array of all the cards with titles
      const cardTitle = el.queryAll(By.css(".mat-mdc-card-title"));

      //Check is it empty array with all titles
      expect(cardTitle.length).toBeGreaterThan(0, "Could not find card titles");

      expect(cardTitle[0].nativeElement.textContent).toContain("Angular Security Course - Web Security Fundamentals", "Could not the same name of the course");
    });


  }));

});



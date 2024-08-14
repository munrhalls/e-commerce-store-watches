import * as categoryTreeActions from "../../category-tree.actions";
import { CategoryTreeEffects } from "../../category-tree.effects";
import { EffectsModule } from "@ngrx/effects";
import { Actions } from "@ngrx/effects";
import { CategoriesService } from "../../../../categories.service";
import { CategoryTree } from "../../../../categories.model";
import { ServerConnectionError } from "../../../../../../@core/error-handler/errors/serverConnectionError";

import {
  categoryTreeReducer,
  State,
  initialState,
} from "../../category-tree.reducer";

import { Store, StoreModule } from "@ngrx/store";

import { fakeAsync, tick, TestBed, flush } from "@angular/core/testing";

import { selectCategoryTree } from "../../category-tree.selectors";

import { of, pipe } from "rxjs";
import { take } from "rxjs/operators";

describe("CREATE: dispatch ACTION to SELECTOR expected state change", () => {
  let actual: CategoryTree;
  let mockCategoriesService: CategoriesService;
  let store: Store;
  let effects: CategoryTreeEffects;

  const setupTestBed = () => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        StoreModule.forFeature("categoryTree", categoryTreeReducer),
        EffectsModule.forRoot([CategoryTreeEffects]),
      ],
      providers: [
        CategoryTreeEffects,
        Store,
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    });
    store = TestBed.inject(Store);
    effects = TestBed.inject(CategoryTreeEffects);
  };

  it("success path: action -> effect returns success action -> selector reflects state update ", (done) => {
    // ARRANGE (DATA)
    const initialTree = {
      id: "mock",
      name: "mock category",
      pathIds: ["mock"],
      children: [],
    };

    const newCategory = {
      id: "mock",
      name: "mock category",
      pathIds: ["mock"],
      children: [],
    };

    // ARRANGE (SETUP)
    const action = categoryTreeActions.apiAdd({
      targetPathIds: ["mock"],
      newCategory: newCategory,
    });
    const expectedResultAction = categoryTreeActions.apiAddSuccess({
      categoryTree: newCategory,
    });
    const expectedResultState: State = {
      categoryTree: {
        data: newCategory,
        isLoading: false,
        error: null,
      },
    };

    mockCategoriesService = {
      addCategory: jest.fn(() => of(newCategory)),
    } as unknown as CategoriesService;

    setupTestBed();

    // ASSERT
    effects.apiAdd$.subscribe((result) => {
      expect(result).toEqual(expectedResultAction);
      done();
      expect(selectCategoryTree.projector(initialState)).toEqual(newCategory);
    });

    // ACT
    store.dispatch(action);
  });
});

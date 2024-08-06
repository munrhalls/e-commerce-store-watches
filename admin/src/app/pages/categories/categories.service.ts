// category.service.ts
import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { cloneDeep } from "lodash";
import { categoryTree as mockCategoryTree } from "./tests/unit/categories.mock-data.spec";
import { CategoryTree } from "./categories.model";
import { ServerConnectionError } from "./../../@core/error-handler/errors/serverConnectionError";
import { HttpErrorResponse } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class CategoriesService {
  constructor(private http: HttpClient) {}
  private categoryTree: CategoryTree | null = mockCategoryTree;

  initializeCategoryTree() {}

  fetchCategoryTree(): Observable<CategoryTree> {
    return this.http.get<CategoryTree>("/api/categories").pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) {
          return throwError(() => new ServerConnectionError());
        } else {
          return throwError(() => error);
        }
      }),
    );
  }
  getCategoryTree() {
    return cloneDeep(this.categoryTree);
  }
  findCategoryByPathIds(node: CategoryTree): CategoryTree {
    for (const id of node.pathIds) {
      node = node.children.find((child) => child.id === id);
    }
    return node;
  }
  addCategoryToTarget(target: CategoryTree): CategoryTree {
    const newId = (Math.random() / Math.random()).toString();
    const newCategory = {
      id: newId,
      name,
      pathIds: [...target.pathIds, newId],
      children: [],
    };
    target.children = [...target.children, newCategory];
    const clone = cloneDeep(this.categoryTree);

    return cloneDeep(this.categoryTree);
  }
  updateTargetName(pathIds: string[], name: string): void {
    const node = this.findCategoryByPathIds(pathIds);
    node.name = name;
  }
  deleteTarget(pathIds: string[]): void {
    const parentPathIds = pathIds.slice(0, -1);
    const parentNode = this.findCategoryByPathIds(parentPathIds);
    const index = parentNode.children.findIndex(
      (child) => child.id === pathIds[pathIds.length - 1],
    );
    parentNode.children.splice(index, 1);
  }
  moveTargetDown(pathIds: string[]): void {
    const parentPathIds = pathIds.slice(0, -1);
    const parentNode = this.findCategoryByPathIds(parentPathIds);
    const index = parentNode.children.findIndex(
      (child) => child.id === pathIds[pathIds.length - 1],
    );
    if (index < parentNode.children.length - 1) {
      const target = parentNode.children[index];
      parentNode.children.splice(index, 1);
      parentNode.children.splice(index + 1, 0, target);
    }
  }
  moveTargetUp(pathIds: string[]): void {
    const parentPathIds = pathIds.slice(0, -1);
    const parentNode = this.findCategoryByPathIds(parentPathIds);
    const targetIndex = parentNode.children.findIndex(
      (child) => child.id === pathIds[pathIds.length - 1],
    );
    if (targetIndex > 0) {
      const target = parentNode.children[targetIndex];
      parentNode.children.splice(targetIndex, 1);
      parentNode.children.splice(targetIndex - 1, 0, target);
    }
  }
}

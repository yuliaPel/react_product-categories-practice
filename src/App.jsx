/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    categoryFromServer => categoryFromServer.id === product.categoryId,
  );
  const user = usersFromServer.find(
    userFromServer => userFromServer.id === category.ownerId,
  );

  return {
    ...product,
    category,
    user,
  };
});

export const App = () => {
  const [filterByOwner, setFilterByOwner] = useState('All');
  const [filterByProductName, setFilterByProductName] = useState('');
  const [filterByCategory, setFilterByCategory] = useState([]);
  const isFilterByCategory = filterByCategory.length !== 0;

  const getFiltereProduct = arrOfProducts => {
    let newProducts = [...products];

    if (filterByOwner !== 'All') {
      newProducts = arrOfProducts.filter(
        product => product.user.name === filterByOwner,
      );
    }

    if (filterByProductName !== '') {
      newProducts = newProducts.filter(newProduct =>
        newProduct.name
          .toLowerCase()
          .includes(filterByProductName.toLowerCase()),
      );
    }

    if (isFilterByCategory) {
      newProducts = newProducts.filter(product =>
        filterByCategory.includes(product.category.title),
      );
    }

    return newProducts;
  };

  const filteredProducts = getFiltereProduct(products);
  const isProducts = filteredProducts.length !== 0;

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                className={`${filterByOwner === 'All' ? 'is-active' : ''}`}
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setFilterByOwner('All')}
              >
                All
              </a>

              {usersFromServer.map(user => {
                return (
                  <a
                    className={`${filterByOwner === user.name ? 'is-active' : ''}`}
                    data-cy="FilterUser"
                    href="#/"
                    onClick={() => setFilterByOwner(user.name)}
                    key={user.id}
                  >
                    {user.name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={filterByProductName}
                  onChange={event => setFilterByProductName(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {filterByProductName && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setFilterByProductName('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button is-success mr-6 ${isFilterByCategory ? 'is-outlined' : ''}`}
                onClick={() => setFilterByCategory([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => {
                return (
                  <a
                    data-cy="Category"
                    className={`button mr-2 my-1
                      ${filterByCategory.includes(category.title) ? 'is-info' : ''}`}
                    href="#/"
                    onClick={() => {
                      if (filterByCategory.includes(category.title)) {
                        setFilterByCategory(prev =>
                          prev.filter(item => item !== category.title),
                        );
                      } else {
                        setFilterByCategory(prev => [...prev, category.title]);
                      }
                    }}
                    key={category.id}
                  >
                    {category.title}
                  </a>
                );
              })}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setFilterByOwner('All');
                  setFilterByProductName('');
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!isProducts && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {isProducts && (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(product => {
                  return (
                    <tr data-cy="Product" key={product.id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="ProductCategory">
                        {`${product.category.icon} - ${product.category.title}`}
                      </td>

                      <td
                        data-cy="ProductUser"
                        className={`${product.user.sex === 'm' ? 'has-text-link' : 'has-text-danger'}`}
                      >
                        {product.user.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

import axios from "axios";

export const UsersManagementFetcher = axios.create({
  baseURL: "http://localhost:4001/api",
  timeout: 40000,
  // headers: {'X-Custom-Header': 'foobar'}
});

export const DubenzeneFetcher = axios.create({
  baseURL: "http://localhost:4001/api",
  timeout: 40000,
  // headers: {'X-Custom-Header': 'foobar'}
});

export const UsersManagementFetcherSecurity = (token: string) => {
  return axios.create({
    baseURL: "http://localhost:4001/api",
    timeout: 40000,
    headers: { "x-jwt-token": token },
  });
};

export const SchemaDiscover = axios.create({
  baseURL: "http://localhost:8080/v1/schema-discover",
  timeout: 40000,
  // headers: {'X-Custom-Header': 'foobar'}
});

export const ProjectManager = axios.create({
  baseURL: "http://localhost:8080/v1/project-manager",
  timeout: 40000,
  // headers: {'X-Custom-Header': 'foobar'}
});

export const DataLoader = axios.create({
  baseURL: "http://localhost:8080/v1/data-loader",
  timeout: 40000,
  // headers: {'X-Custom-Header': 'foobar'}
});

export const Runner = axios.create({
  baseURL: "http://localhost:3000/v1",
  timeout: 40000,
  // headers: {'X-Custom-Header': 'foobar'}
});

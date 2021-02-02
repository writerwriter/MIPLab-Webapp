# web

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## api
```
abnormal response = {
    header: ...,
    data: {
        raw: Array of size [#channels, signal length],
        abnormal_rate: Float,
    }
}
hazard response = {
    header: ...,
    data: {
        raw: Array of size [#channels, signal length],
        hazard: Float array of size [#hazards],
    }
}

```
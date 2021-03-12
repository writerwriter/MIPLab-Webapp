# CardioTool
>current version: v1.3.1

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

### Deploy using nginx inside of a docker container
```
docker build . -t <name>
docker run -d -p 8081:8081 <name>
```

## api
### apiFileUpload
> front-end will send raw file to back-end, api should return two signals(ECG, PCG) data.
```
response = {
    header: ...,
    data: {
        ECG: Array with size [signal length],
        PCG: Array with size [signal length],
    }
}
```
### apiFileSave
> front-end will send a snp file and back-end should save the file and return the save status.
```
response = {
    header: ...,
    data: {
        status: 'success' or 'failed',
    }
}
```
### apiPQRSTResult
> front-end will send the ECG signal, api should return the PQRST segmentation label and intervals calculated by model.
```
response = {
    header: ...,
    data: {
        raw: Array with size [signal length], preprocessed ECG signal,
        label: Array with size [1, #classes, signal length],
        interval: Dictionary with 4 segments' mean and variance value,
    }
}
```
### apiABResult
> front-end will send the ECG and PCG signal, api should return the normal/abnormal rate calculated by three different model.
``` 
response = {
    header: ...,
    data: {
        label: Array with size [3] determine the normal/abnormal rate calculated by three different model,
    }
}
```
### apiArrResult
> front-end will send the ECG signal, api should return the Arrhythmia classification result calculated by model.
```
response = {
    header: ...,
    data: {
        label: Array with size [2, #peaks] determine each peak's location and classification result,
    }
}
```
### apiPCGResult
> front-end will send the PCG signal, api should return the preprocessed signal and S1,S2,S3/4 positions calculated by model.
```
response = {
    header: ...,
    data: {
        PCG: Array with size [1, 1, signal length], the preprocessed PCG signal,
        label: Array with size [3, #peaks], determine the positions of S1, S2, and S3/S4 peaks,
    }
}
```
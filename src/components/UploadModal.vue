<template>
<div id='uupload-modal-container'>
    <b-button id="upload-file" @click="toggleModal" variant='success'>Upload</b-button>

        <b-modal id='submit-file' ref="submit-file" title="Upload File">
                <b-form>
                    <b-form-group
                    label="File name:"
                    label-for="input-name"
                    >
                        <b-form-input 
                        id="input-name"
                        v-model='name' 
                        placeholder='Enter File Name'
                        :state='nameState'
                        ></b-form-input>
                        <b-form-invalid-feedback>File name cannot be empty</b-form-invalid-feedback>
                    </b-form-group>

                    <b-form-group
                    label="Select tag type:"
                    label-for="input-tag"
                    >
                        <b-form-select
                        id="input-tag"
                        v-model='selectedTag'
                        :options='tagOptions'
                        :state='tagState'
                        ></b-form-select>
                    </b-form-group>
                </b-form>

                <template #modal-footer="{cancel}">
                    <b-badge v-if="show_upload_status" :variant="upload_status_variant">{{upload_status}}</b-badge>
                    <b-overlay
                    :show="loading_status"
                    spinner-variant="success"
                    spinner-type="border"
                    >
                        <b-button variant='success' @click='onSubmit'>Upload</b-button>
                    </b-overlay>
                    <b-button variant='secondary' @click='cancel()'>Cancel</b-button>
                </template>
        </b-modal>
</div>
</template>

<script>
import {apiFileSave} from '@/api.js'
import store from '@/store';
export default {
    data(){
        return {
            name: '',
            selectedTag: null,
            tagOptions: [
                {value: null, text: "Please select a tag"},
                {value: "Normal", text: "Normal"},
                {value: "Abnormal", text: "Abnormal"},
            ],
            show_upload_status: false,
            upload_status: '',
            loading_status: false,
        }
    },
    computed: {
        nameState(){
            return this.name.length > 0 ? true : false;
        },
        tagState(){
            return this.selectedTag == null ? false : true;
        },
        upload_status_variant(){
            return this.upload_status == 'success' ? "success" : "danger";
        },
    },
    methods: {
        onSubmit(event) {
            event.preventDefault();
            if(store.state.file != null && this.name != null && this.name != '' && this.selectedTag != null){
                var formdata = new FormData();
                formdata.append("snp", store.state.file);
                formdata.append("name", this.name);
                formdata.append("tag", this.selectedTag);
                this.show_upload_status = false;
                this.loading_status = true;
                apiFileSave(formdata)
                .then(res=>{
                    this.upload_status = res.data['status'];
                    this.show_upload_status=true;
                    this.loading_status = false;
                })
                .catch(err=>{
                    console.log(err);
                })
                //console.log(this.name, this.selectedTag);
            }
            else{
                if(store.state.file == null){
                    this.upload_status = "file required";
                }
                else if(this.name == null || this.name == ''){
                    this.upload_status = "file name required";
                }
                else if(this.selectedTag == null){
                    this.upload_status = "tag required";
                }
                this.show_upload_status = true;
            }
        },
        toggleModal() {
            this.$refs['submit-file'].toggle('#upload-file');
            this.name = store.state.file != null ? store.state.file.name.split('.', 1)[0] : '';
        }
    }
}
</script>

<style scoped>
.upload-modal-container{
    padding: 0;
    margin: 0;
}
</style>
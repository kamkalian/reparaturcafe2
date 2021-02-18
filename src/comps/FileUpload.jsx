import React from 'react';
import {DropzoneArea} from 'material-ui-dropzone'


export default class FileUpload extends React.Component {
    render(){
        console.log(this.props.files);
        return (
            <DropzoneArea
                fileObjects={this.props.files}
                onChange={this.props.handleDropzoneChange.bind(this)}
                acceptedFiles={[".png"]}
                dropzoneText="Klicke hier um Fotos hochzuladen."
            />
        );
    }

}
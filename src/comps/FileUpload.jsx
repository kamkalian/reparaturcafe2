import React from 'react';
import Button from '@material-ui/core/Button';


export default class FileUpload extends React.Component {
    render(){
        return (
            <Button
            variant="contained"
            component="label"
            color="primary"
            >
            + Foto hochladen
            <input
                type="file"
                hidden
                onChange={this.props.handleUploadInputChange}
            />
            </Button>
        );
    }

}
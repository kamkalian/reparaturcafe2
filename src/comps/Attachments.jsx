import React from 'react';

import FileUpload from './FileUpload';
import Grid from '@material-ui/core/Grid';


export default class Attachments extends React.Component {
    render(){
        const thumbs = this.props.files.map ((item, index) => {
            return(
                <img src={"./images/" + item} width="200"/>
            );
        });
        return (
            <Grid container>
                <Grid item xs={12}>
                    <FileUpload
                        handleUploadInputChange={this.props.handleUploadInputChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    {thumbs}
                </Grid>
            </Grid>
        );
    }

}
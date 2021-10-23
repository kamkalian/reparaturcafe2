import React from 'react';
import FileUpload from './FileUpload';
import Grid from '@mui/material/Grid';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';


class Attachments extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            images: [],
        }
    }

    callImageFetch(filename){
        fetch('/api/image', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'img_filename': filename}),
        })
        .then((response) => {
            if(response.status===200){
                response.blob()
                .then(imageBlob => {
                    this.setState({
                        images: this.state.images.concat({'image':URL.createObjectURL(imageBlob), 'filename':filename})
                    });
                });
            }
        })
    }

    componentDidMount(){
        this.setState({
            images: []
        }, () => {
            this.props.files.map((tile) => {
                this.callImageFetch(tile);
                return null;
            });
        });
    }

    componentDidUpdate(prevProps){
        // console.log(this.props.files);
        if (prevProps.files !== this.props.files) {
            this.setState({
                images: []
            }, function(){
                this.props.files.map((tile) => {
                    this.callImageFetch(tile);
                    return null;
                });
            });
        }
    }
  
    render(){
        const getGridListCols = () => {
        
            return 2;
          }

        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <FileUpload
                        handleUploadInputChange={this.props.handleUploadInputChange}
                    />
                </Grid>
                <Grid item xs={12}>
                <ImageList cellHeight={140} cols={getGridListCols()}>
                    {this.state.images.map((tile) => (
                    <ImageListItem key={tile.filename} cols={1}>
                        <img src={tile.image} alt={tile.image}/>
                        <ImageListItemBar                       
                        actionIcon={
                            <IconButton color="secondary" onClick={this.props.handleDeleteAttachmentButton.bind(this, tile.filename)}>
                                <DeleteIcon />
                            </IconButton>
                        }
                        />
                    </ImageListItem>
                    ))}
                </ImageList>
                </Grid>
            </Grid>
        );
    }

}


export default (Attachments);
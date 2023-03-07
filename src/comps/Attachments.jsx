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
            addButtonVisible: this.props.addButtonVisible,
            deleteable: this.props.deleteable,
        }
    }

    callImageFetch(filename){
        fetch('/api/image/'+filename, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
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
            if(this.props.files){
                this.props.files.map((tile) => {
                    this.callImageFetch(tile);
                    return null;
                });
            }else{ 
                return null;
            }
        });
    }

    componentDidUpdate(prevProps){
        // console.log(this.props.files);
        if (prevProps.files !== this.props.files) {
            this.setState({
                images: []
            }, function(){
                if(this.props.files){
                    this.props.files.map((tile) => {
                        this.callImageFetch(tile);
                        return null;
                    });
                }else{ 
                    return null;
                }
            });
        }
    }
  
    render(){
        const getGridListCols = () => {
        
            return 3;
          }

        return (
            <Grid container spacing={3}>
                {this.state.addButtonVisible ? (
                    <Grid item xs={12}>
                        <FileUpload
                            handleUploadInputChange={this.props.handleUploadInputChange}
                        />
                    </Grid>
                ) : ""}
                <Grid item xs={12}>
                <ImageList sx={{ width: 500, height: 250 }} rowHeight={140} cols={getGridListCols()}>
                    {this.state.images.map((tile) => (
                    <ImageListItem key={tile.filename} cols={1}>
                        <img src={tile.image} alt={tile.image}/>
                        {this.state.deleteable ? (
                            <ImageListItemBar                       
                            actionIcon={
                                <IconButton color="secondary" onClick={this.props.handleDeleteAttachmentButton.bind(this, tile.filename)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                            />
                        ) : ""}
                    </ImageListItem>
                    ))}
                </ImageList>
                </Grid>
            </Grid>
        );
    }

}


export default (Attachments);
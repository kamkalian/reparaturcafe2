import React from 'react';
import FileUpload from './FileUpload';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import DeleteIcon from '@material-ui/icons/Delete';


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
                });
            });
        }
    }
  

    render(){
        const getGridListCols = () => {
            if (isWidthUp('xl', this.props.width)) {
              return 5;
            }
        
            if (isWidthUp('lg', this.props.width)) {
              return 4;
            }
        
            if (isWidthUp('md', this.props.width)) {
              return 3;
            }
        
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
                <GridList cellHeight={140} cols={getGridListCols()}>
                    {this.state.images.map((tile) => (
                    <GridListTile key={tile.filename} cols={1}>
                        <img src={tile.image} />
                        <GridListTileBar                       
                        actionIcon={
                            <IconButton color="secondary" onClick={this.props.handleDeleteAttachmentButton.bind(this, tile.filename)}>
                                <DeleteIcon />
                            </IconButton>
                        }
                        />
                    </GridListTile>
                    ))}
                </GridList>
                </Grid>
            </Grid>
        );
    }

}


export default withWidth()(Attachments);
import React from 'react';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import ContactForm from '../ContactForm';
import DeviceForm from '../DeviceForm';
import FaultDescriptionField from '../FaultDescriptionField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import Attachments from '../Attachments';


export default class NewTaskFormular extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            activeStep: 0,
            gender: "?",
            firstName: "",
            lastName: "",
            street: "",
            houseNumber: "",
            postCode: "",
            prefixNumber: "",
            phone:"",
            email:"",
            categoryName: "",
            manufacturerName: "",
            devName: "",
            devModel: "",
            electricalMechanical: "",
            accessories: [],
            openCategory: false,
            openManufacturer: false,
            openAccessories: false,
            faultDescription: "",
            stepReleased: [],
            nameError: true,
            telEmailError: true,
            devNameError: true,
            faultDescriptionError:true,
            dataProtection:false,
            formLocked:true,
            completed:false,
            error:false,
            tskID: "",
            tskToken: "",
            files: [],
            newsletter: false,
        }
    }


    apiCall = () => {
        fetch('/api/new_task', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': this.props.csrfToken,
            },
            body: JSON.stringify({
                gender: this.state.gender,
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                street: this.state.street,
                houseNumber: this.state.houseNumber,
                postCode: this.state.postCode,
                prefixNumber: this.state.prefixNumber,
                phone: this.state.phone,
                email: this.state.email,
                categoryName: this.state.categoryName,
                manufacturerName: this.state.manufacturerName,
                devName: this.state.devName,
                devModel: this.state.devModel,
                electricalMechanical: this.state.electricalMechanical,
                accessories: this.state.accessories,
                faultDescription: this.state.faultDescription,
                files: this.state.files,
            })
        })
        .then(res => res.json())
        .then(
            (result) => {
            this.setState({
                activeStep: this.state.activeStep + 1,
                completed: true,
                tskToken: result.tsk_token,
                tskID: result.tsk_id
            });
            },
            (error) => {
            this.setState({
                activeStep: this.state.activeStep + 1,
                completed: true,
                error: true,
            });
            }
        )        
    }


    handleStep = (step) => () => {
        this.setState({
            activeStep: step
        });
        this.checkStepCompleted();
    };

    handleNext = () => {
        this.setState({
            activeStep: this.state.activeStep + 1
        });
        this.checkStepCompleted();
    }

    handleBack = () => {
        if(this.state.activeStep !== 0){
            this.setState(
                {
                    activeStep: this.state.activeStep - 1
                }
            )
            this.checkStepCompleted();
        }
    }

    handleUploadInputChange = (event) => {
        const fd = new FormData();
        fd.append('file', event.target.files[0]);
        fetch('/api/upload_image', {
            method: 'POST',
            body: fd
        })
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    files: this.state.files.concat(result.filename)
                }, function() {
                    this.checkStepCompleted();
                });
            })
        .catch(err => console.error(err)); 
        event.target.value = '';
    }

    handleDeleteAttachmentButton = (file, event) => {
        var array = [...this.state.files];
        var index = this.state.files.indexOf(file);
        if (index !== -1){
            array.splice(index, 1);
        }
        this.setState({
            files: array
        }, function(){
            this.checkStepCompleted();
        });
        
    }

    handleReset(){
        this.setState(
            {
                activeStep: 0
            }
        )
    }

    checkNameCompleted = () => {
        if(this.state.lastName !== "" || this.state.firstName !== ""){
            this.setState({nameError: false});
            return true;
        }
        this.setState({nameError: true});
        return false;
    }

    checkTelOrEmailCompleted = () => {
        if(this.state.phone !== "" || this.state.email !== ""){
            this.setState({telEmailError: false});
            return true;
        }
        this.setState({telEmailError: true});
        return false;
    }

    checkDevNameCompleted = () => {
        if(this.state.devName !==""){
            this.setState({devNameError: false});
            return true;
        }
        this.setState({devNameError: true});
        return false;
    }

    checkFaultDescriptionCompleted = () => {
        if(this.state.faultDescription.length > 49){
            this.setState({faultDescriptionError: false});
            return true;
        }
        this.setState({faultDescriptionError: true});
        return false;
    }

    checkStepCompleted = () => {
        var array = [...this.state.stepReleased];

        if(this.checkNameCompleted() && this.checkTelOrEmailCompleted()) {
            array[0] = true;
            this.setState({stepReleased: array}, function(){this.checkFormCompleted()});
        }else {
            array[0] = false;
            this.setState({stepReleased: array}, function(){this.checkFormCompleted()});
        }

        if(this.checkDevNameCompleted()){
            array[1] = true;
            this.setState({stepReleased: array, devNameError: false}, function(){this.checkFormCompleted()});
        }else{
            array[1] = false;
            this.setState({stepReleased: array, devNameError: true}, function(){this.checkFormCompleted()});
        }

        if(this.checkFaultDescriptionCompleted()){
            array[2] = true;
            this.setState({stepReleased: array}, function(){this.checkFormCompleted()});
        }else{
            array[2] = false;
            this.setState({stepReleased: array}, function(){this.checkFormCompleted()});
        }

        if(this.state.files.length > 0){
            array[3] = true;
            this.setState({stepReleased: array}, function(){this.checkFormCompleted()});
        }else{
            array[3] = false;
            this.setState({stepReleased: array}, function(){this.checkFormCompleted()});
        }

        if(this.state.dataProtection){
            array[4] = true;
            this.setState({stepReleased: array}, function(){this.checkFormCompleted()});
        }else{
            array[4] = false;
            this.setState({stepReleased: array}, function(){this.checkFormCompleted()});
        }
    }

    checkFormCompleted = () => {
        if(
            this.state.stepReleased[0] &&
            this.state.stepReleased[1] &&
            this.state.stepReleased[2] &&
            this.state.stepReleased[4]
        ) this.setState({formLocked:false});
        else this.setState({formLocked:true});
    }

    handleTextInputChange = (event) => {
        switch(event.currentTarget.id) {
            case 'firstName':
                this.setState({firstName: event.target.value}, function() {
                    this.checkNameCompleted();
                });
                return false;
            case 'lastName':
                this.setState({lastName: event.target.value}, function() {
                    this.checkNameCompleted();
                });
                return false;
            case 'prefixNumber':
                this.setState({prefixNumber: event.target.value})
                return false;
            case 'phone':
                this.setState({phone: event.target.value}, function() {
                    this.checkTelOrEmailCompleted();
                });
                return false;
            case 'email':
                this.setState({email: event.target.value}, function() {
                    this.checkTelOrEmailCompleted();
                });
                return false;
            case 'devName':
                this.setState({devName: event.target.value}, function() {
                    this.checkDevNameCompleted();
                });
                return false;
            case 'devModel':
                this.setState({devModel: event.target.value})
                return false;
            case 'faultDescription':
                this.setState({faultDescription: event.target.value}, function() {
                    this.checkFaultDescriptionCompleted();
                });
                return false;
            default:
              return false;
        }

        

    }

    getSteps() {
        return ['Kontaktdaten', 'Gerätedaten', 'Fehlerbeschreibung', "Fotos", 'Prüfen und Abschicken'];
    }

    getStepContent(step) {
        const acc = this.state.accessories.map((item, index) => {
            return item + ", ";
        });
        switch (step) {
            case 0:
            return (
                <React.Fragment>
                    <Grid item xs={12}>
                        <Typography>Damit wir dich bei Rückfragen erreichen können brauchen wir ein paar Daten von dir.</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <ContactForm 
                        firstName={this.state.firstName}
                        lastName={this.state.lastName}
                        prefixNumber={this.state.prefixNumber}
                        phone={this.state.phone}
                        email={this.state.email}
                        handleTextInputChange={this.handleTextInputChange}
                        nameError={this.state.nameError}
                        telEmailError={this.state.telEmailError}
                        />
                    </Grid>
                </React.Fragment>
            );
            case 1:
            return (
                <React.Fragment>
                    <Grid item xs={12}>
                        <Typography>Gib uns hier Informationen über dein Gerät. Versuche dabei so viele Angaben wie möglich zu machen.</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <DeviceForm 
                        manufacturerName={this.state.manufacturerName}
                        categoryName={this.state.categoryName}
                        handleOpen={this.handleOpen}
                        handleClose={this.handleClose}
                        handleSelectionClick={this.handleSelectionClick}
                        handleSelectedDelete={this.handleSelectedDelete}
                        openCategory={this.state.openCategory}
                        openManufacturer={this.state.openManufacturer}
                        openAccessories={this.state.openAccessories}
                        devName={this.state.devName}
                        devModel={this.state.devModel}
                        electricalMechanical={this.state.electricalMechanical}
                        handleRadioChange={this.handleRadioChange}
                        handleTextInputChange={this.handleTextInputChange}
                        accessories={this.state.accessories}
                        devNameError={this.state.devNameError}
                        />
                    </Grid>
                </React.Fragment>
            );
            case 2:
            return (
                <React.Fragment>
                    <Grid item xs={12}>
                        <Typography>Erzähle uns was an deinem Gerät defekt ist. Versuche dabei so genau wie möglich den Defekt zu beschreiben. Hilfreich ist auch, wenn du uns beschreiben kannst wie es zu dem Defekt gekommen ist.</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <FaultDescriptionField 
                        faultDescription={this.state.faultDescription}
                        handleTextInputChange={this.handleTextInputChange}
                        faultDescriptionError={this.state.faultDescriptionError}
                        />
                    </Grid>
                </React.Fragment>
            );
            case 3:
                return (
                    <React.Fragment>
                    <Grid item xs={12}>
                        <Typography>Mit einem Foto kannst du uns eventuell zeigen wo das Problem liegt. Wenn möglich lade gerne mehrere Fotos von deinem Gerät hoch. </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        
                        <Attachments
                        files={this.state.files}
                        handleUploadInputChange={this.handleUploadInputChange}
                        handleDeleteAttachmentButton={this.handleDeleteAttachmentButton}
                        />
                    </Grid>
                    </React.Fragment>
                )
            case 4:
            return (
                <React.Fragment>
                    <Grid item xs={12}>
                        <Typography>Überprüfe hier nochmal alle Deine eingegebenen Daten.</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                Kontaktdaten
                                </Typography>
                                
                                <Typography variant="body2" component="p">
                                    {this.state.firstName}, {this.state.lastName}, {this.state.gender}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    {this.state.street} {this.state.houseNumber}, {this.state.postCode}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    Tel: {this.state.prefixNumber} {this.state.phone}, Email: {this.state.email}
                                </Typography>
                                
                                <Typography color="textSecondary" style={{marginTop:20}}>
                                Gerätedaten
                                </Typography>
                                <Typography variant="body2" component="p">
                                    Fehlerbeschreibung: {this.state.faultDescription}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    Bezeichnung: {this.state.devName}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    Hersteller: {this.state.manufacturerName}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    Modell: {this.state.devModel}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    Gerätekategorie: {this.state.categoryName}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    Strom oder Mechanisch: {this.state.electricalMechanical}
                                </Typography>
                                <Typography variant="body2" component="p">
                                    Zubehör: {acc}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    value={this.state.dataProtection}
                                    checked={this.state.dataProtection}
                                    onChange={this.handleDataProtectionChange}
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            }
                            label="Bitte bestätige das du die Datenschutzerklärung gelesen und verstanden hast."
                            className={this.state.dataProtection ? 'checked-box' : 'important-box'}
                            style={{paddingRight:10, borderRadius:5, marginLeft:0}}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    value={this.state.newsletter}
                                    checked={this.state.newsletter}
                                    onChange={this.handleNewsletterChange}
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            }
                            label="Aktiviere dieses Häckchen, wenn die AWO Oberlar dir einen Newsletter per Email schicken darf."
                            style={{paddingRight:10, borderRadius:5, marginLeft:0}}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <div 
                        className={!this.state.formLocked ? 'checked-box' : 'important-box'}
                        style={{padding:10, borderRadius:5}}>
                            {!this.state.formLocked ? "Du kannst jetzt das Formular abschicken." : (
                                <ul>
                                {!this.state.stepReleased[0] ? (
                                    <li><Typography>Du hast noch nicht alle nötigen Kontaktdaten eingegeben.</Typography></li>) : ""}
                                {!this.state.stepReleased[1] ? (
                                    <li><Typography>Es fehlt noch die Gerätebezeichnung.</Typography></li>) : ""}
                                {!this.state.stepReleased[2] ? (
                                    <li><Typography>Gebe bei der Fehlerbeschreibung mindestens 50 Zeichen ein.</Typography></li>) : ""}
                                {!this.state.stepReleased[4] ? (
                                    <li><Typography>Bestätigung zur Datenschutzerklärung fehlt.</Typography></li>) : ""}
                                
                                </ul>
                            )}
                        </div>
                    </Grid>
                </React.Fragment>
            );
          default:
            return 'Unknown step';
        }
    }

    handleSelectionClick = (event) => {
        switch(event.currentTarget.dataset.statename) {
            case 'manufacturerName':
                this.setState({
                    manufacturerName: event.currentTarget.dataset.id,
                    openManufacturer: false})
                return false;
            case 'categoryName':
                this.setState({
                    categoryName: event.currentTarget.dataset.id,
                    openCategory: false})
                return false;
            case 'accessories':
                this.setState({
                    accessories: this.state.accessories.concat([event.currentTarget.dataset.id]),
                    openAccessories: false})
                return false;
            default:
                return false;
        }
    }

    handleSelectedDelete = (statename, event) => {
        switch(statename) {
            case 'manufacturerName':
                this.setState({manufacturerName: ""})
                return false;
            case 'categoryName':
                this.setState({categoryName: ""})
                return false;
            case 'accessories':
                var array = [...this.state.accessories]; // make a separate copy of the array
                var index = array.indexOf(event.currentTarget.dataset.id)
                if (index !== -1) {
                    array.splice(index, 1);
                    this.setState({accessories: array});
                }
                return false;
            default:
                return false;
        }
    }

    handleOpen = (event) => {
        if(event.currentTarget.id === "selectFieldCategory"){
            this.setState({ openCategory: true })
        }else if(event.currentTarget.id === "selectFieldManufacturer"){
            this.setState({ openManufacturer: true })
        }else if(event.currentTarget.id === "addAccessories"){
            this.setState({ openAccessories: true })
        }
    }

    handleClose = () => {
        this.setState({ openCategory: false, openManufacturer: false, openAccessories: false })
    }

    handleRadioChange = (event) => {
        this.setState({ electricalMechanical: event.currentTarget.value });
    }

    handleDataProtectionChange = (event) => {
        this.setState({
            dataProtection: event.currentTarget.checked,
        }, function () {
            this.checkStepCompleted();
        });
    }

    handleNewsletterChange = (event) => {
        this.setState({
            newsletter: event.currentTarget.checked,
        }, function () {
            this.checkStepCompleted();
        });
    }

    render(){    
        const steps = this.getSteps();
        return(
            <Box>
                <h2>Formular</h2>
                <Grid container>
                    <Grid item>
                        {!this.state.completed ? (
                            <Stepper 
                            activeStep={this.state.activeStep} 
                            orientation="vertical"
                            style={{padding:0}}
                            nonLinear >
                            {steps.map((label, index) => (
                            <Step key={label}>
                                <StepButton onClick={this.handleStep(index)} completed={this.state.stepReleased[index]}>
                                    <h3>{label}</h3>
                                </StepButton>
                                
                                <StepContent>
                                    <Grid container spacing={5}>
                                        {this.getStepContent(index)}
                                        <Grid item xs={12}>
                                            {this.state.activeStep ? (
                                                <Button
                                                onClick={this.handleBack}
                                                >
                                                    Zurück
                                                </Button>
                                            ) : ""}
                                            {this.state.activeStep === steps.length - 1 ? (
                                                <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={this.apiCall}
                                                disabled={this.state.formLocked}
                                                >
                                                    Abschicken
                                                </Button>
                                            ) : (
                                                <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={this.handleNext}
                                                >
                                                    Weiter
                                                </Button>
                                            )}                           
                                        </Grid>
                                    </Grid>
                                </StepContent>
                            </Step>
                            ))}
                        </Stepper>
                    ) : (
                        
                        this.state.error ? (
                            <div>
                                <Typography component="p">
                                    "Irgendwas ist schief gelaufen. Bitte versuche es später noch einmal." 
                                </Typography>
                            </div>
                        ): (
                                window.location.href = "/qrcode/tsk" + this.state.tskToken + "?new=1"
                        )
                        
                    )}
                </Grid>    
            </Grid>
        </Box>
        );
    }

}
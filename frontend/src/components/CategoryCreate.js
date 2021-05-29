import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import  CategoryForm from './CategoryForm';
import SectionHeader  from './molecules/SectionHeader/SectionHeader';
import  Section  from './organisms/Section/Section';

const useStyles = makeStyles(theme => ({
  formContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: `calc(100vh - ${theme.mixins.toolbar['@media (min-width:600px)'].minHeight}px)`,
    maxWidth: 500,
    margin: `0 auto`,
  },
  section: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

const CategoryCreate = ({ location, history }) => {
  const classes = useStyles();
  
  
  return (
    <div>
      <Section className={classes.section}>
        <div className={classes.formContainer}>
          <SectionHeader
            title="Category"
            titleProps={{
              variant: 'h3',
            }}
          />
           <CategoryForm location={location} history={history}/> 
        </div>
      </Section>

    </div>
  );
};

export default CategoryCreate;
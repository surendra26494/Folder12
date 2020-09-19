import React from 'react';
import { Route } from 'react-router-dom';
import { firestore, convertCollectionsSnapshotToMap } from '../../firebase/firebase.utils';
import CollectionsOverview from '../../components/collections-overview/collections-overview.component';
import CollectionPage from '../collection/collection.component';
import { connect } from 'react-redux';
import { updateCollections } from '../../redux/shop/shop.actions';


class ShopPage extends React.Component {
  unsubscribeFromAuth = null;
  componentDidMount() {
    const { updateCollections } = this.props;
    const collectionRef = firestore.collection('collections');
    this.unsubscribeFromAuth = collectionRef.onSnapshot(async snapshot => {
      const collectionMap = convertCollectionsSnapshotToMap(snapshot);
      updateCollections(collectionMap)

    })
  }

  render() {
    const { match } = this.props;
    console.log(this.props, "surendra")
    return (
      <div className='shop-page'>
        <Route exact path={`${match.path}`} component={CollectionsOverview} />
        <Route path={`${match.path}/:collectionId`} component={CollectionPage} />
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  updateCollections: collectionMap => dispatch(updateCollections(collectionMap))
})

export default connect(
  null,
  mapDispatchToProps
)(ShopPage);

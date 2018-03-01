import { connect } from 'react-redux';
import { like, unlike } from '../../actions/likeState';
import { addComment } from '../../actions/commentState';
import View from './View';

const mapDispatchToProps = {
  like,
  unlike,
  addComment
};

const mapStateToProps = state => ({
  session: state.routes.session,
  likeState: state.likeState,
  commentState: state.commentState
});

export default connect(mapStateToProps, mapDispatchToProps)(View);
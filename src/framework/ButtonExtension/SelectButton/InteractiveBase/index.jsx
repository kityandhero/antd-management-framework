import { isFunction, showRuntimeErrorMessage, toNumber } from '@/utils/tools';
import { selectModeCollection } from '@/utils/constants';

import Base from '../Base';

class InteractiveBase extends Base {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,
      ...{
        drawerVisible: false,
        modalVisible: false,
      },
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return super.getDerivedStateFromProps(nextProps, prevState);
  }

  showSelect = () => {
    const { selectMode } = this.props;

    if (toNumber(selectMode) === selectModeCollection.drawer) {
      this.showDrawer();
    }

    if (toNumber(selectMode) === selectModeCollection.modal) {
      this.showModal();
    }
  };

  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    });
  };

  afterDrawerClose = () => {
    this.setState({ drawerVisible: false });
  };

  afterDrawerSelectSuccess = (o) => {
    this.afterSelectSuccessCore(o);
  };

  showModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  afterModalSelectSuccess = (o) => {
    this.setState({
      modalVisible: false,
    });

    this.afterSelectSuccessCore(o);
  };

  afterModalCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  afterSelectSuccessCore = (o) => {
    if ((o || null) == null) {
      return;
    }

    const { afterSelect } = this.props;

    this.setState({
      selectData: o,
    });

    if (isFunction(afterSelect)) {
      afterSelect(o);
    }
  };

  renderSelectDrawer = () => {
    showRuntimeErrorMessage('需要实现 renderSelectDrawer 方法');
  };

  renderSelectModal = () => {
    showRuntimeErrorMessage('需要实现 renderSelectModal 方法');
  };

  renderOther = () => {
    const { selectMode } = this.props;

    if (toNumber(selectMode) === selectModeCollection.drawer) {
      return this.renderSelectDrawer();
    }

    if (toNumber(selectMode) === selectModeCollection.modal) {
      return this.renderSelectModal();
    }

    showRuntimeErrorMessage('无效的选择项渲染模式');

    return null;
  };
}

InteractiveBase.defaultProps = {
  selectMode: selectModeCollection.drawer,
};

export default InteractiveBase;

	require('normalize.css/normalize.css');
	require('styles/App.css');

	import React from 'react';
	import ReactDOM from 'react-dom'

	//获取图片相关详细
	var imgDatas = require('../data/imgData.json');
	//利用自执行函数，将图片名信息转化成图片路径
	imgDatas = (function(imgDatas) {
		for (let i = 0; i < imgDatas.length; i++) {
			var singleImgData = imgDatas[i];
			//加载图片路径
			singleImgData.imgUrl = require('../images/' + singleImgData.fileName);
			imgDatas[i] = singleImgData;
		}
		return imgDatas;
	})(imgDatas);

	//图片组件
	var ImgFigure = React.createClass({
		handleClick: function(e) {
			if (this.props.arrange.isCenter) {
				this.props.inverse();
			} else {
				this.props.center();
			}

			e.stopPropagation();
			e.preventDefault();
		},
		render: function() {
			var styleObj = {};

			if (this.props.arrange.pos) {
				styleObj = this.props.arrange.pos;
			}
			if (this.props.arrange.rotate) {
				(['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function(value) {
					styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
				}.bind(this));
			}
			if (this.props.arrange.isCenter) {
				styleObj.zIndex = 11;
			}
			var imgFigureClassName = "img-figure";
			imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : ' ';
			return (
				<figure className={imgFigureClassName} ref='imgFrgure0' style={styleObj} onClick = {this.handleClick}>
					<img src={this.props.data.imgUrl} alt={this.props.data.title} />
				<figcaption>
				<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
				<div className="rearContent">
					{this.props.data.title}
				</div>	
				</figure>
			)
		}
	})
	var ControllerUnites = React.createClass({
		handleClick: function(e) {
			if (this.props.arrange.isCenter) {
				this.props.inverse();
			} else {
				this.props.center();
			}
			e.stopPropagation();
			e.preventDefault();
		},
		render: function() {
			var controllerUnitesClassName = 'controller-unite';
			if (this.props.arrange.isCenter) {
				controllerUnitesClassName += ' c-is-center';
			}
			if (this.props.arrange.isInverse) {
				controllerUnitesClassName += ' c-is-inserse';
			}
			return (
				<div className={controllerUnitesClassName} onClick= {this.handleClick}>
				</div>
			)
		}
	})

	//舞台
	var AppComponent = React.createClass({

		Constant: {
			centerPos: { //中间图片的位置
				left: 0,
				top: 0
			},
			hPosRange: { //水平方向的取值范围
				leftSecX: [0, 0],
				rightSecX: [0, 0],
				y: [0, 0]
			},
			vPosRange: { //竖直方向的取值范围
				x: [0, 0],
				topY: [0, 0]
			}
		},
		getInitialState: function() {
			return {
				imgsArrangeArr: []
			}
		},

		/*
		 * 重新排布所有图片
		 * @param centerIndex 指定中间显示那张图片 
		 * 
		 */
		rearRange: function(centerIndex) {

			var imgsArrangeArr = this.state.imgsArrangeArr,
				Constant = this.Constant,
				centerPos = Constant.centerPos,
				hPosRange = Constant.hPosRange,
				vPosRange = Constant.vPosRange,
				hPosRangeLeftSecX = hPosRange.leftSecX,
				hPosRangeRightSecX = hPosRange.rightSecX,
				hPosRangeY = hPosRange.y,
				vPosRangeTopY = vPosRange.topY,
				vPosRangeX = vPosRange.x,

				imgsArrangeTopArr = [],
				topImgNum = Math.ceil(Math.random() * 2),
				topImgSpliceIndex = 0,
				imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

			//首先居中centerIndex的图片
			imgsArrangeCenterArr[0] = {
				pos: centerPos,
				rotate: 0,
				isCenter: true
			};

			//取出要布局上侧的图片状态信息
			topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

			//布局位于上侧的图片
			imgsArrangeTopArr.forEach(function(value, index) {
				imgsArrangeTopArr[index] = {
					pos: {
						top: this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
						left: this.getRangeRandom(vPosRangeX[0], vPosRangeX[1])
					},
					rotate: this.getRotateRandom(),
					isCenter: false
				}
			}.bind(this));

			//  前半部分布局左边，后半部分布局右边
			for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i <= j; i++) {
				var hPosRangelORX = null;

				if (i < k) {
					hPosRangelORX = hPosRangeLeftSecX;
				} else {
					hPosRangelORX = hPosRangeRightSecX;
				}

				imgsArrangeArr[i] = {
					pos: {
						top: this.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
						left: this.getRangeRandom(hPosRangelORX[0], hPosRangelORX[1])
					},
					rotate: this.getRotateRandom(),
					isCenter: false
				}
			}

			if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
				imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
			}

			imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
			console.log(imgsArrangeCenterArr[0]);
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			})
		},

		/*
		 *
		 * 利用rearRange函数，居中对应的图片
		 * @param index ,需要被居中的照片对应的图片信息数组的index值
		 * @return {Function}
		 */
		center: function(index) {
			return function() {
				this.rearRange(index);
			}.bind(this);
		},

		/*
		 * 获取区间内的一个随机值
		 * 
		 */
		getRangeRandom: function(low, high) {
			return Math.ceil(Math.random() * (high - low) + low);
		},

		/*
		 * 获取一个随机旋转的值
		 *
		 */
		getRotateRandom: function() {

			return Math.random() > 0.5 ? Math.ceil(Math.random() * 45) : "-" + Math.ceil(Math.random() * 45);
		},

		/*
		 * 图片翻转
		 * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
		 * @return {Funtion} 这是一个闭包函数，其内返回一个真正待执行的函数
		 */
		inverse: function(index) {
			return function() {
				var imgsArrangeArr = this.state.imgsArrangeArr;

				imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
				this.setState({
					imgsArrangeArr: imgsArrangeArr
				})
			}.bind(this);
		},


		//当组件加载完毕，为每张图片计算其位置的范围
		componentDidMount: function() {

			//舞台大小
			var stageDom = ReactDOM.findDOMNode(this.refs.stage),
				stageW = stageDom.scrollWidth,
				stageH = stageDom.scrollHeight,
				halfStageH = Math.ceil(stageH / 2),
				halfStageW = Math.ceil(stageW / 2)

			//一张imgFigure的大小
			var imgFrgureDOM = ReactDOM.findDOMNode(this.refs.imgFrgure0),
				imgW = imgFrgureDOM.scrollWidth,
				imgH = imgFrgureDOM.scrollHeight,
				halfImgW = Math.ceil(imgW / 2),
				halfImgH = Math.ceil(imgH / 2);

			//计算左侧右侧区域图片排布位置的取值范围
			this.Constant.centerPos = {
				left: halfStageW - halfImgW,
				top: halfStageH - halfImgH
			}

			this.Constant.hPosRange.leftSecX[0] = -halfImgW;
			this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
			this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
			this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
			this.Constant.hPosRange.y[0] = -halfImgH;
			this.Constant.hPosRange.y[1] = stageH - halfImgH;

			//计算上侧区域图片排布位置的取值范围
			this.Constant.vPosRange.topY[0] = -halfImgH;
			this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
			this.Constant.vPosRange.x[0] = halfStageW - imgW;
			this.Constant.vPosRange.x[1] = halfStageW;
			this.rearRange(Math.ceil(Math.random() * this.state.imgsArrangeArr.length));
		},

		render: function() {
			var controllerUnites = [];
			var imgFrgures = [];

			//imgFrgures模板存储
			imgDatas.forEach(function(value, index) {
				if (!this.state.imgsArrangeArr[index]) {
					this.state.imgsArrangeArr[index] = {
						pos: {
							left: 0,
							top: 0
						},
						rotate: 0,
						isInverse: false,
						isCenter: false
					}
				}

				imgFrgures.push(<ImgFigure key={index} data={value} ref={'imgFrgure' + index} arrange={this.state.imgsArrangeArr[index]} inverse = {this.inverse(index)} center= {this.center(index)}/>);
				controllerUnites.push(<ControllerUnites key={index} arrange={this.state.imgsArrangeArr[index]} inverse = {this.inverse(index)} center= {this.center(index)} />)
			}.bind(this));

			return (
				<section className="index" ref="stage">
				  <section className='photoWall'>
				  	{imgFrgures}
				  </section>
				  <nav className='controller-nav'>
				  	{controllerUnites}
				  </nav>
				 </section>
			);
		}
	})


	AppComponent.defaultProps = {};

	export default AppComponent;
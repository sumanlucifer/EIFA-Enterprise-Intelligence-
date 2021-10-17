sap.ui.define([
        "./ULText",
        "sap/ui/layout/Grid"
    ],

    function(ULText, Grid) {

        var KPIChartTileRenderer = {};
        KPIChartTileRenderer.render = function(oRm, oControl) {
            var cardBorder = oControl.getShowBorder() ? 'border: solid 1px #eaeaf2;' : '';
            var cardSize = !oControl.getFitToParent() ? `width:${oControl.getSize().split('x')[0]*10}rem;  height:${oControl.getSize().split('x')[1]*10}rem;` :
                `width:90%; height:${oControl.getSize().split('x')[1]*10}rem;`;

            var cardOutlineBegin =
                `
								<div style="box-shadow: 0 3px 6px 0 #0000000d;  ${cardBorder}
								background-color: #ffffff;  padding:1rem; margin:10px;  display:inline-block;  
								${cardSize}
								">
							`;

            var cardOutlineEnd = `
									</div>
								`;
            var title = new ULText({
                text: oControl.getTitle(),
                ulColor: '#ffe600',
                ulWidth: '50%'
            })

            var chartCanvas = `<canvas style="margin-top:15px;width:90%;  height:80%;" id="${oControl.getId()+'--chartCanvas'}"></canvas>`;

            var infoValue = `<div style="font-size: 30px;  color: #858593; margin-top: 15px;">${oControl.getInfo()}</div>`;

            var mesL = new sap.m.Text({
                text: oControl.getMesL()
            }).addStyleClass("textMeasure");

            var mesR = new sap.m.Text({
                text: oControl.getMesR()
            }).addStyleClass("textMeasure");

            var labL = new sap.m.Text({
                text: oControl.getLabL(),
                wrapping: true,
                maxLines: 2
            }).addStyleClass("textMeasureLabel");

            var labR = new sap.m.Text({
                text: oControl.getLabR(),
                wrapping: true,
                maxLines: 2
            }).addStyleClass("textMeasureLabel");

            if (oControl.getCardType() === "numeric") {
                var numeric = new sap.m.HeaderContainer({
                    content: [
                        new sap.m.VBox({
                            alignItems: "Center",
                            width: `${oControl.getSize().split('x')[0]*10/2.2}rem`,
                            items: [mesL, labL]
                        }),
                        new sap.m.VBox({
                            alignItems: "Center",
                            width: `${oControl.getSize().split('x')[0]*10/2.2}rem`,
                            items: [mesR, labR]
                        })
                    ]
                }).addStyleClass('sapUiSmallMarginTop')
            } else if (oControl.getCardType() === "radial") {
                var radial = new sap.m.HBox({
                    items: [
                        new sap.m.VBox({
                            alignItems: "Center",
                            width: `${oControl.getSize().split('x')[0]*10/2}rem`,
                            items: [
                                new sap.ui.core.HTML({
                                    content: `<div style="margin-top: 1.25rem;" id=${oControl.getId() + '--radialChart'}>`,
                                }).addStyleClass('sapUiSmallMarginTop')
                            ]
                        }),
                        new sap.m.HeaderContainer({
                            orientation: "Vertical",
                            content: [
                                new sap.m.VBox({
                                    alignItems: "Center",
                                    items: [mesL, labL]
                                }),
                                new sap.m.VBox({
                                    alignItems: "Center",
                                    items: [mesR, labR]
                                })
                            ]
                        })
                    ]
                });
            } else if (oControl.getCardType() === "radialSummary") {
                var radialSummary = new sap.m.HBox({
                    justifyContent: "Center",
                    items: [
                        new sap.ui.core.HTML({
                            content: `<div style="margin-top: 1.25rem;" id=${oControl.getId() + '--radialChartSummary'}>`,
                        }).addStyleClass('sapUiSmallMarginTop'),
                        new sap.m.VBox({
                            items: [
                                title.addStyleClass('sapUiSmallMarginBegin'),
                                new sap.ui.core.HTML({
                                    content: `<div style="margin-top: 1.25rem;" id=${oControl.getId() + '--radialChartSummary'}>
										<ul style="font-family: EYInterstate ! important;">
										  <li style="color:${oControl.getRadialColor()}">${oControl.getRadialSummaryValue()}</li>
										  <li style="color: #737384;">${oControl.getRadialSummaryBase()}</li>
										</ul> 
									`,
                                })
                            ]
                        }).addStyleClass('sapUiLargeMarginTop sapUiMediumMarginBegin')
                    ]
                })
            } else if (oControl.getCardType() === "measureBlock") {
                var aMeasure = oControl.getMeasureBlock().map(function(e) {
                    return new sap.m.VBox({
                        alignItems: "Start",
                        items: [
                            new sap.m.Text({
                                text: e.text
                            }).addStyleClass("measureBlockText"),
                            new sap.m.Text({
                                text: e.value
                            }).addStyleClass("measureBlockKPI"),
                            new ey.cc.eycc.controls.Progress({
                                width: "8rem",
                                percentage: e.value,
                                visible: oControl.getProgressVisible(),
                                height: "8px",
                                color: e.value > 50 ? '#8ce8ad' : '#ffb46a'
                            })
                        ]
                    }).addStyleClass('sapUiSmallMarginBeginEnd')
                })
                var measureBlock = new sap.m.HeaderContainer({
                    content: [
                        new sap.ui.core.HTML({
                            content: `<div style="margin-top: 1.25rem;margin-right:2rem;" id=${oControl.getId() + '--radialChartMeasureBlock'}>`,
                        }).addStyleClass('sapUiSmallMarginTop sapUiSmallMarginEnd'),
                        new Grid({
                            position: "Center",
                            content: aMeasure,
                            defaultSpan: "XL4 L4 M6 S12"
                        }).addStyleClass('sapUiTinyMargin')
                    ]
                })
            }

            // Start Rendering Controls Conditionally - Pinaki

            oRm.write(`<div style='display: inline-block; ${oControl.getFitToParent()?'width:100%;':''} '`);
            oRm.writeControlData(oControl);
            this.addCustomStyleClass(oRm, oControl);
            oRm.write(">");
            oRm.write(cardOutlineBegin);
            if (oControl.getCardType() !== "radialSummary") {
                oRm.renderControl(title);
            }
            if (oControl.getCardType() === "chart") {
                oRm.write(chartCanvas);
            }
            if (oControl.getCardType() === "info") {
                oRm.write(infoValue);
            }
            if (oControl.getCardType() === "numeric") {
                oRm.renderControl(numeric);
            }
            if (oControl.getCardType() === "radial") {
                oRm.renderControl(radial);
            }
            if (oControl.getCardType() === "radialSummary") {
                oRm.renderControl(radialSummary);
            }
            if (oControl.getCardType() === "measureBlock") {
                oRm.renderControl(measureBlock);
            }
            oRm.write(cardOutlineEnd);
            oRm.write("</div>");
        };
        KPIChartTileRenderer.addCustomStyleClass = function(oRm, oControl) {
            if (!oControl.aCustomStyleClasses) {
                return;
            }
            oControl.aCustomStyleClasses.forEach(function(e) {
                oRm.addClass(e);
                oRm.writeClasses();
            }.bind(this));
        };
        return KPIChartTileRenderer;
    });
class HexUtils

    _drawHex = (drawNode, hex) ->
        drawNode.drawPoly hex.corners, cc.color(255, 255, 255), 1, cc.color(0, 0, 255)
        drawNode

    hexes: {}
    hexesConfig:
        type: 'Pointy topped'
        coordinateSystem: 'Axial'
        startFrom: 'Left-top'
        cornersCount: 6
    setHexesConfig: (size) ->
        @hexesConfig.hexSize = size
        @hexesConfig.hexHeight = size * 2
        @hexesConfig.hexWidth = Math.sqrt(3) / 2 * @hexesConfig.hexHeight
        @hexesConfig.horizontalDistance = @hexesConfig.hexWidth
    convertCubeToAxial: (x, z) ->
        q: x
        r: z
    convertAxialToCube: (q, r) ->
        x: q
        z: r
        y: (-x) - z
    calculateHex: (centerX, centerY) ->
        hex =
            centerX: centerX
            centerY: centerY
            corners: []

        for i in [0...@hexesConfig.cornersCount]
            angle = 2 * Math.PI / @hexesConfig.cornersCount * (i + 0.5)
            hex.corners.push
                x: centerX + @hexesConfig.hexSize * Math.cos angle
                y: centerY + @hexesConfig.hexSize * Math.sin angle
        hex
    generateHexesGrid: (centerX, centerY, widthHexCount, heightHexCount) ->
        hexesCount = widthHexCount * heightHexCount
        for i in [0...hexesCount]
            hex = {}
            if i is 0
                hex = @calculateHex centerX, centerY
            else
                hex = @calculateHex newHexCenterX, newHexCenterY
            offset = @getOffsetForHex centerX, centerY, widthHexCount, heightHexCount, i
            newHexCenterX = offset.x
            newHexCenterY = offset.y
            axial = @getAxialCoords widthHexCount, heightHexCount, i
            hex.q = axial.q
            hex.r = axial.r
            hex.id = ObjectsUtils::getCustomPostfixId "#{hex.q}-#{hex.r}"
            hex.alias = "HEX_#{hex.q}-#{hex.r}"
            @hexes[hex.alias] = hex
        @hexes
    getOffsetForHex: (centerX, centerY, widthHexCount, heightHexCount, hexNumber) ->
        distance = @hexesConfig.hexSize
        result = {}
        if hexNumber is 0
            result.x = centerX
            result.y = centerY
        else if hexNumber <= widthHexCount
            result.x = centerX + (distance * hexNumber)
            result.y = centerY
        else if hexNumber > widthHexCount
            r = hexNumber % widthHexCount
            offsetInHexes = hexNumber - (widthHexCount * r)
            result.x = centerX + (distance * (offsetInHexes-1))
            result.y = centerY + (distance * r)
        result
    getAxialCoords: (widthHexCount, heightHexCount, hexNumber) ->
        result = {}
        if hexNumber is 0
            result.q = 0
            result.r = 0
        else if hexNumber <= widthHexCount
            result.q = hexNumber
            result.r = 0
        else if hexNumber > widthHexCount
            r = hexNumber % widthHexCount
            result.q = hexNumber - (r * widthHexCount)
            result.r = r
        result
    drawHex: (centerX, centerY) ->
        drawNode = new cc.DrawNode
        _drawHex drawNode, @calculateHex centerX, centerY

    drawHexesGrid: (hexes) ->
        hexes = hexes || @hexes
        drawNode = new cc.DrawNode
        for k of hexes
            _drawHex drawNode, hexes[k] if hexes.hasOwnProperty k
        return drawNode
    drawHexesGridNumbers: (hexes, node, zOrder) ->
        hexes = hexes || @hexes
        for k of hexes
            if hexes.hasOwnProperty k
                hexLabel = new cc.LabelTTF("#{hexes[k].q} #{hexes[k].r}", "Arial", 10)
                hexLabel.setColor(cc.color(0, 0, 255));
                hexLabel.x = hexes[k].centerX
                hexLabel.y = hexes[k].centerY
                node.addChild hexLabel, zOrder

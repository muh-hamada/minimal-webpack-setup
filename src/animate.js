export function followPath(elem, path) {
    let counter = 0;
    let isMoving = true;
    const curveLength = path.length();

    function moveStar() {
        if (parseInt(counter, 10) === 1) {
            isMoving = false;
        }

        if (isMoving) {
            counter += 0.003;
        }

        /*	Now the magic part. We are able to call .getPointAtLength on the tow paths to return
            the coordinates at any point along their lengths. We then simply set the stars to be positioned
            at these coordinates, incrementing along the lengths of the paths */
        elem.attr("transform", "translate(" + (path.pointAt(counter * curveLength).x - 15) + "," + (path.pointAt(counter * curveLength).y - 15) + ")");

        /*	Use requestAnimationFrame to recursively call moveStar() 60 times a second
            to create the illusion of movement */
        requestAnimationFrame(moveStar);
    }

    requestAnimationFrame(moveStar);
}


const log = require('winston');
var ctrls = require('../controllers');
var models = require('../models');

module.exports = {
    /**
     * Validates schema before creating a teacher
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    validateCreate: (req, res, next) => {
        log.info('Module - ValidateCreate Teacher');

        // Validate schema
        log.info('Validating teacher model...')
        var teacher = new models.teachers(req.body);
        var error = teacher.validateSync();

        if (error) {
            log.error('Teacher model validation failed!');
            let err = new Error('Teacher Validation Failed!');
            err.status = 400;
            // Remove stack trace but retain detailed description of validation errors
            err.data = JSON.parse(JSON.stringify(error));
            next(err);
            return;
        }

        log.info('Teacher model has been validated!');
        next();
    },
    /**
     * Creates a teacher
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with newly created teacher document
     */
    create: (req, res, next) => {
        log.info('Module - Create Teacher');
        var teacher = new models.teachers(req.body);
        ctrls.mongodb.save(teacher, (err, result) => {
            if (err) {
                let err = new Error('Failed creating teacher!');
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully created teacher');
            res.locals = result;
            next();
        });
    },
    /**
     * Gets all teachers
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with array of all teachers documents
     */
    getAll: (req, res, next) => {
        log.info('Module - GetAll Teachers');
        ctrls.mongodb.find(models.teachers, {}, (err, results) => {
            if (err) {
                let err = new Error('Failed getting all teachers!');
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found all teachers.');
            res.locals = results;
            next();
        });
    },
    /**
     * Validates path id parameter
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     */
    validatePathId: (req, res, next) => {
        log.info('Module - validatePathId Teacher');

        log.info('Validating request...');
        if (!req.params.id) {
            log.error('Request validation failed');
            let err = new Error('Missing required id parameter in the request path. (/teachers/:id)');
            err.status = 400;
            next(err);
            return;
        }

        if (!ctrls.mongodb.isObjectId(req.params.id)) {
            log.error('Request validation failed');
            let err = new Error('Invalid id parameter in the request path.');
            err.status = 400;
            next(err);
            return;
        }

        log.info('Request validated!');
        next();
    },
    /**
     * Gets a teacher
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with teacher document
     */
    getOne: (req, res, next) => {
        log.info('Module - GetOne Teacer');
        ctrls.mongodb.findById(models.teachers, req.params.id, (err, result) => {
            if (err) {
                let err = new Error('Failed getting teacher: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully found teacher [' + req.params.id + ']');
            res.locals = result;
            next();
        });
    },
    /**
     * Deletes a teacher
     * @param  {object}   req  Request object
     * @param  {object}   res  Response object
     * @param  {Function} next Callback function to move on to the next middleware
     * @return {object}        Populates res.locals with deletion result
     */
    deleteOne: (req, res, next) => {
        log.info('Module - DeleteOne Teacher');
        ctrls.mongodb.findByIdAndRemove(models.teachers, req.params.id, (err, result) => {
            if (err) {
                let err = new Error('Failed deleting teacher: ' + req.params.id);
                err.status = 500;
                next(err);
                return;
            }
            log.info('Successfully deleted teacher [' + req.params.id + ']');
            res.locals = result;
            next();
        });
    }
};

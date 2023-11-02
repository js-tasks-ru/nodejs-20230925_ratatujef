/* eslint-disable max-len */
const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    describe('checking type', ()=>{
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
        },
      });

      it('checking number instead of string ', ()=>{
        const errors = validator.validate({name: 16});
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
      });
    });

    describe('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });
      it('checking too short', ()=>{
        const errors = validator.validate({name: 'Lalala'});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
      });

      it('checking too long', ()=>{
        const longName = 'Lalala-Lalala-Lalala-LalalaLalala-Lalala';
        const errors = validator.validate({name: longName});

        expect(errors).to.have.length(1);
        expect(errors[0]).to.have.property('field').and.to.be.equal('name');
        expect(errors[0]).to.have.property('error').and.to.be.equal(`too long, expect 20, got ${longName.length}`);
      });
    });

    describe('checking number fields', ()=>{
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 90,
        },
      });

      it('checking too small', ()=>{
        const tooLittleErrors = validator.validate({age: 16});

        expect(tooLittleErrors).to.have.length(1);
        expect(tooLittleErrors[0]).to.have.property('field').and.to.be.equal('age');
        expect(tooLittleErrors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 16');
      });

      it('checking too big', ()=>{
        const tooBigErrors = validator.validate({age: 91});

        expect(tooBigErrors).to.have.length(1);
        expect(tooBigErrors[0]).to.have.property('field').and.to.be.equal('age');
        expect(tooBigErrors[0]).to.have.property('error').and.to.be.equal('too big, expect 90, got 91');
      });
    });

    describe('checking more', ()=>{
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      it('checking rule is not defined ', ()=>{
        const [error] = validator.validate();
        expect(error).to.have.property('error').and.to.be.equal('rule is not defined');
      });

      it('checking wrong field', ()=>{
        const errors = validator.validate({'someField': 12});
        expect(errors[0]).to.have.property('field').and.to.be.equal('age');
        expect(errors[0]).to.have.property('error').and.to.be.equal('rule name age is not defined');
      });
    });
  });
});

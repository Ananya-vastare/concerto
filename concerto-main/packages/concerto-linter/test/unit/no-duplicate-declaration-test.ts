import { Linter } from '@accordproject/concerto-linter';
import { DefaultRuleset } from '@accordproject/concerto-linter-default-ruleset';

// Define a type for linter results to satisfy TypeScript
interface LintResult {
    rule: string;
    message: string;
}

describe('no-duplicate-declarations', () => {

    it('should allow unique assets without violations', async () => {
        const model = `
        namespace org.example

        asset Car identified by vin {
            o String vin
        }

        asset Driver identified by license {
            o String license
        }
        `;

        const linter = new Linter();
        linter.addRuleset(DefaultRuleset);

        const results: LintResult[] = await linter.lint(model);

        // Assert there are no violations
        expect(results).toHaveLength(0);
    });

    it('should detect duplicate asset names as violations', async () => {
        const model = `
        namespace org.example

        asset Car identified by vin {
            o String vin
        }

        asset Car identified by vin {
            o String vin
        }
        `;

        const linter = new Linter();
        linter.addRuleset(DefaultRuleset);

        const results: LintResult[] = await linter.lint(model);

        // Assert that at least one violation exists
        expect(results.length).toBeGreaterThan(0);

        // Assert that the duplicate declaration rule specifically fired
        const duplicateViolation = results.find((r: LintResult) => r.rule === 'no-duplicate-declarations');
        expect(duplicateViolation).toBeDefined();
        expect(duplicateViolation?.message).toMatch(/duplicate/i);

        // Optional: log violations for clarity (can help during review)
        console.log('Duplicate declaration violations:', results);
    });

});
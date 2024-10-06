import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column()
    accountExternalIdDebit: string;

    @Column()
    accountExternalIdCredit: string;

    @Column()
    transferTypeId: number;

    @Column()
    value: number;

    @Column({ default: 'pending' })
    status: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    constructor(
        accountExternalIdDebit: string,
        accountExternalIdCredit: string,
        transferTypeId: number,
        value: number,
        transactionStatus?: string,
        createdAt?: Date
    ) {
        this.accountExternalIdDebit = accountExternalIdDebit;
        this.accountExternalIdCredit = accountExternalIdCredit;
        this.transferTypeId = transferTypeId;
        this.value = value;
        this.status = transactionStatus || 'pending';
        this.createdAt = createdAt || new Date();
    }
}

import { Component } from '@angular/core';
import { Card } from '@components/common/card/card';
import { Container } from '@components/common/container/container';

@Component({
  selector: 'app-home',
  imports: [Card, Container],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
